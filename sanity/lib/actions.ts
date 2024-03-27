import { sanityClient } from './client'
import { supabaseClient } from '../../src/utils/supabaseClient'
// @ts-ignore


export function approveDocumentAction(props: any) {
  const isDev = process.env.NODE_ENV === 'development';
  const supabase = supabaseClient();

  const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

  return {
    label: 'Approve listing',

    onHandle: async () => {
      console.log('Approving document:', props);
      const { id, published } = props
      // console.log('Approving document:', id, published);

      if (published === undefined || !published) {

        window.alert('Must publish the document before approving it.');
        return;
      } else {


        try {
          const query = `*[_type == "needsApproval" && _id == $id][0]`;
          const documentToApprove = await sanityClient.fetch(query, { id });

          if (!documentToApprove) {
            console.error('Document not found');
            return;
          }

          const newDocument = {
            ...documentToApprove,
            _id: undefined,
            _type: 'listing'
          };

          const createdListing = await sanityClient.create(newDocument);


          const customerEmail = newDocument.userInfo.email;

          // Check if the Stripe customer exists or create a new one
          let customers = await stripe.customers.list({
            email: customerEmail,
            limit: 1,
          });

          console.log('Customers:', customers);

          let customerId;

          if (customers.data.length === 0) {
            // Create a new customer
            const customer = await stripe.customers.create({
              email: customerEmail,
              // payment_method: paymentMethod.id, // Attach the payment method  
              source: 'tok_visa'
            });
            customerId = customer.id;
          } else {
            customerId = customers.data[0].id;
            await stripe.customers.createSource(customerId, {
              source: 'tok_visa',
            });
          }

          console.log('Customer ID:', customerId);

          // Assuming you have a price ID from your Stripe dashboard
          const priceId = 'price_1ORU7BDhCJq1hRSteuSGgKDk';

          // Create the subscription
          const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{ price: priceId }],
            // Add any other subscription details here
          });

          console.log('Subscription created:', subscription);

          // const { data: userCreationData, error: userCreationError } =
          //   await supabase.auth.resetPasswordForEmail(
          //     documentToApprove.userInfo.email,
          //     {
          //       redirectTo: isDev
          //         ? 'http://localhost:3000/sign-up'
          //         : 'https://swom.travel/sign-up',
          //     });

          console.log(' documentToApprove._id:', documentToApprove._id);

          // refresh supabase client to ensure i can add to listings page:

          const { data: userData, error } = await supabase.auth.admin.createUser({
            email: documentToApprove.userInfo.email,
            email_confirm: true,
            password: 'password',
            user_metadata: {
              name: documentToApprove.userInfo.name,
              dob: documentToApprove.userInfo.dob || '',
              phone: documentToApprove.userInfo.phone,
              role: 'member',
            },
          });

          console.log('userData:', userData?.user?.id);



          if (documentToApprove && documentToApprove._id && userData.user && userData.user.id) {
            const { data: user, error: userError } = await supabase
              .from('listings')
              .insert(
                {
                  user_id: userData.user.id,
                  userInfo: documentToApprove.userInfo,
                  homeInfo: documentToApprove.homeInfo,
                  amenities: documentToApprove.amenities,
                }
              )
              .select('*');

            const { data: appUserData, error: appUserDataError } = await supabase
              .from('appUsers')
              .insert({
                id: userData.user.id,
                name: documentToApprove.userInfo.name,
                email: documentToApprove.userInfo.email,
                profession: documentToApprove.userInfo.profession,
                age: documentToApprove.userInfo.age,
                profileImage: documentToApprove.userInfo.profileImage,
                role: 'member',
              })
          }



          await sanityClient.delete(documentToApprove._id);


          console.log('Listing approved and moved to listings:', createdListing);
        } catch (error) {
          console.error('Error in approving listing:', error);
        }
      }

    }
  }
}
