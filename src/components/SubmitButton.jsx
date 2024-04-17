export default function SubmitButton({ isSubmitting, isError }) {
  let className =
    "border-[3px] border-solid border-[#b9ae8c] rounded-lg p-2 cursor-pointer max-w-[10rem] mt-[2rem]";

  if (isSubmitting) {
    className += " opacity-70";
  }

  return (
    <button
      type="submit"
      disabled={isSubmitting || isError}
      className={className}
    >
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  );
}
