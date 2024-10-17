export default function SubmitButton({
  isSubmitting,
  isError = "",
  btnTextDefault = "Submit",
  btnTextPending = "Submitting...",
}) {
  let className =
    "bg-[#136c72] text-white text-lg border-none rounded-lg py-3 cursor-pointer max-w-52";

  if (isSubmitting) {
    className += " opacity-70";
  }

  return (
    <button
      type="submit"
      disabled={isSubmitting || isError}
      className={className}
    >
      {isSubmitting ? btnTextPending : btnTextDefault}
    </button>
  );
}
