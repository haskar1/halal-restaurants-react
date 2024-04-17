"use client";

import Link from "next/link";

export default function UpdateButton(props) {
  return (
    <Link
      href={props.href}
      className="bg-blue-500 hover:bg-blue-700 text-white hover:text-white
      font-bold py-2 px-4 rounded"
      onClick={(e) => {
        e.target.textContent = "Loading...";
      }}
    >
      {props.text}
    </Link>
  );
}
