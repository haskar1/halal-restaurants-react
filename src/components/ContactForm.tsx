"use client";

import { FC } from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import SubmitButton from "./SubmitButton";

export type FormData = {
  email: string;
  message: string;
};

const Contact: FC = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const [messageStatus, setMessageStatus] = useState("default");
  const [sendInProgress, setSendInProgress] = useState(false);

  const onSubmit = (data: FormData) => {
    setSendInProgress(true);
    fetch("/api/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (res.status !== 200) {
          setMessageStatus("failed");
        } else {
          setMessageStatus("sent");
        }
        setSendInProgress(false);
      })
      .catch((err) => {
        console.log(err);
        setMessageStatus("failed");
        setSendInProgress(false);
      });
  };

  return (
    <div className="flex justify-center py-12">
      <div className="w-[90%] max-w-lg">
        <h1 className="mb-3 text-slate-700 text-4xl">Contact us</h1>
        <h2 className="mb-11 text-[#136c72] text-xl">
          Have a question or comment? Let us know!
        </h2>
        {messageStatus === "sent" ? (
          <Alert severity="success">
            <span>Your message has been sent!</span>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-8 max-w-xs">
              <label
                htmlFor="email"
                className="mb-2 block text-base font-medium text-black"
              >
                Email Address (optional)
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-base font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md"
                {...register("email", { required: false })}
              />
            </div>
            <div className="mb-8">
              <label
                htmlFor="message"
                className="mb-2 block text-base font-medium text-black"
              >
                Message (required)
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Type your message here"
                className="w-full rounded-md border border-gray-300 bg-white py-3 px-6 text-base font-medium text-gray-700 outline-none focus:border-purple-500 focus:shadow-md"
                {...register("message", { required: true })}
              ></textarea>
            </div>
            {messageStatus === "failed" && (
              <Alert severity="error" className="w-fit">
                <span>Message failed to send. Please try again.</span>
              </Alert>
            )}

            <div>
              <SubmitButton
                isSubmitting={sendInProgress}
                btnTextDefault="Send"
                btnTextPending="Sending..."
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
