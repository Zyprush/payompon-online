import Image from 'next/image'
import React from 'react'

const Header = () => {
  return (
    <div className="flex items-center justify-evenly w-full">
    <div className="custom-shadow rounded-full ml-10">
      <Image
        alt="brgy-logo.png"
        width={100}
        height={100}
        className="rounded-full"
        src={"/img/mamburao-logo.png"}
      />
    </div>
    <div className="mx-auto text-center leading-tight text-sm">
      <h1 className=" font-bold">Republic of the Philippines</h1>
      <h2 className=" font-semibold">PROVINCE OF OCCIDENTAL MINDORO</h2>
      <h3 className=" font-medium">Municipality of Mamburao</h3>
      <h4 className=" font-bold text-red-600">BARANGAY PAYOMPON</h4>
      <h5 className=" text-xl italic font-serif font-bold text-green-800">
        Office of the Punong Barangay
      </h5>
    </div>
    <div className="custom-shadow rounded-full mr-10">
      <Image
        alt="brgy-logo.png"
        width={100}
        height={100}
        src={"/img/brgy-logo.png"}
      />
    </div>
  </div>
  )
}

export default Header