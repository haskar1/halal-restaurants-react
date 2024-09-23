export default function SubmitButton({
  isSubmitting,
  isError = "",
  btnTextDefault = "Submit",
  btnTextPending = "Submitting...",
}) {
  let className =
    "bg-[#136c72] text-white text-lg border-none rounded-lg py-3 px-10 cursor-pointer";

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
