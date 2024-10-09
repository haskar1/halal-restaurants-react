import {
  Footer as FooterFlowbite,
  FooterCopyright,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";
import Link from "next/link";

export default function Footer() {
  return (
    <FooterFlowbite container className="rounded-none bg-[#136c72]">
      <div className="container text-center py-4 sm:py-8 bg-[#136c72]">
        <div className="w-full flex flex-wrap justify-center items-center gap-10 sm:justify-between sm:items-center">
          <Link className="footer-logo block max-w-48 sm:pb-0 sm:pl-4" href="/">
            <img src="/static/images/logo.png" alt="Who is Halal" />
          </Link>
          <div>
            <FooterLinkGroup className="text-base gap-5 text-white p-0 m-0 sm:pr-4">
              <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
              {/* <FooterLink href="#">Licensing</FooterLink> */}
              <FooterLink href="/contact">Contact</FooterLink>
            </FooterLinkGroup>
            <FooterCopyright
              href="/"
              by="Who Is Halal"
              year={new Date().getFullYear()}
              className="footer-copyright text-base text-white text-left pt-2 sm:text-left sm:text-center"
            />
          </div>
        </div>
      </div>
    </FooterFlowbite>
  );
}

// import {
//   Footer as FooterFlowbite,
//   FooterCopyright,
//   FooterDivider,
//   FooterLink,
//   FooterLinkGroup,
// } from "flowbite-react";
// import Link from "next/link";

// export default function Footer() {
//   return (
//     <FooterFlowbite container className="rounded-none bg-[#136c72]">
//       <div className="container text-center py-6 bg-[#136c72]">
//         <div className="w-full sm:flex sm:items-center sm:justify-between">
//           <Link
//             className="footer-logo block max-w-48 pb-5 sm:pb-0 sm:pl-4"
//             href="/"
//           >
//             <img src="/static/images/logo.png" alt="Who is Halal" />
//           </Link>
//           <FooterLinkGroup className="text-base gap-6 text-white p-0 sm:pr-4">
//             <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
//             {/* <FooterLink href="#">Licensing</FooterLink> */}
//             <FooterLink href="/contact">Contact</FooterLink>
//           </FooterLinkGroup>
//         </div>
//         <FooterDivider />
//         <FooterCopyright
//           href="/"
//           by="Who Is Halal"
//           year={new Date().getFullYear()}
//           className="footer-copyright text-base text-white text-left pt-2 sm:pt-6 sm:text-center"
//         />
//       </div>
//     </FooterFlowbite>
//   );
// }
