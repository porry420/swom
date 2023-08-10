import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="md:h-[250px] h-[400px] bg-[#7F8119] md:flex-row flex-col flex justify-center align-middle w-full">
      <div className="md:w-1/2 flex align-middle justify-center gap-4 my-auto  h-1/2">
        <div className="relative flex my-auto h-1/2 w-1/3">
          <Image src="/footer-logo.jpg" alt="logo" fill objectFit="contain" />
        </div>
        <div className=" my-auto border-l-2 px-4 border-white">
          <ul className="text-[#F4ECE8] gap-1 flex flex-col font-extralight">
            <Link href="/">What is Swom</Link>
            <Link href="/">Become a member</Link>
            <Link href="/">How it works</Link>
            <Link href="/">Pricing</Link>
            <Link href="/">About us</Link>
          </ul>
          <div>{/* media icons */}</div>
        </div>
      </div>

      <div className="md:w-1/3 w-3/4  m-auto flex flex-col">
        <p className="text-[#F4ECE8]">Contact us</p>
        <input
          placeholder="Email"
          className="w-full p-4  rounded-lg my-2 bg-[#F4ECE8]"
          type="text"
        />
        <select
          className="w-fit p-4 rounded-lg my-1 bg-[#F4ECE8]"
          name="Language Selection"
          id="">
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
        </select>
      </div>
    </div>
  );
};

export default Footer;
