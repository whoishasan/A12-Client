import { axiosSecure } from "@/hooks/axiosSecure";
import { useQuery } from "@tanstack/react-query";
import { HiOutlineArrowLongLeft } from "react-icons/hi2";
import { Link, useParams } from "react-router-dom";
import NotFound from "../NotFound";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { CiEdit } from "react-icons/ci";
import {
  FacebookShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
} from "react-share";
import { Helmet } from "react-helmet-async";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { ImWhatsapp } from "react-icons/im";
import { Skeleton } from "@/components/ui/skeleton";

const BlogDetails = () => {
  const { id } = useParams();
  const { authData } = useContext(AuthContext);
  const shareUrl = window.location.href;

  const {
    data: postDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogPostDetails"],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/blog/post/details?permaLink=${id}`
      );
      return data;
    },
    retry: false,
  });

  if (postDetails?.status === "draft") {
    return <NotFound />;
  }
  if (error) {
    return <NotFound />;
  }

  return (
    <>
      <Helmet>
        {postDetails && (
          <>
            <title>
              {postDetails?.postTitle || "Blog details"} | Donor. Flow
            </title>
            <meta
              name="description"
              content={
                postDetails?.shortDescription ||
                "Default description for the page"
              }
            />
            <meta property="og:title" content={postDetails?.postTitle} />
            <meta
              property="og:description"
              content={
                postDetails?.shortDescription ||
                "Default description for the page"
              }
            />
            <meta
              property="og:image"
              content={postDetails?.thumb || "fallback-image-url"}
            />
            <meta property="og:url" content={shareUrl} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta
              name="twitter:description"
              content={
                postDetails?.shortDescription ||
                "Default description for the page"
              }
            />
            <meta name="twitter:title" content={postDetails?.postTitle} />
            <meta
              name="twitter:image"
              content={postDetails?.thumb || "fallback-image-url"}
            />
          </>
        )}
      </Helmet>
      <section className="flex justify-center w-full">
        <div className="max-w-[800px] px-5 space-y-10 py-40 w-full">
          <div className="flex justify-between w-full">
            <Link
              className="flex items-center gap-2 text-red-500 group transition-all"
              to={-1}
            >
              <HiOutlineArrowLongLeft
                size={25}
                className="group-hover:-translate-x-3 transition-all"
              />
              Go back
            </Link>
            <div className="flex gap-5">
              {["admin", "volunteer"].includes(authData?.role) && (
                <Link
                  to={`../dashboard/content-management/update-blog/${postDetails?._id}`}
                  className="flex items-center gap-2"
                >
                  <CiEdit />
                  Edit
                </Link>
              )}
              <div className="flex gap-2 items-center flex-wrap">
                <FacebookShareButton url={shareUrl}>
                  <FaFacebookF
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-gray-900 transition-all"
                    size={30}
                  />
                </FacebookShareButton>
                <LinkedinShareButton url={shareUrl}>
                  <FaLinkedinIn
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-gray-900 transition-all"
                    size={30}
                  />
                </LinkedinShareButton>
                <WhatsappShareButton url={shareUrl}>
                  <ImWhatsapp
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-gray-900 transition-all"
                    size={30}
                  />
                </WhatsappShareButton>
              </div>
            </div>
          </div>
          <div className="w-full  space-y-8">
            {isLoading ? (
              <>
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="w-full h-[300px] rounded-2xl" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-40 w-full" />
              </>
            ) : (
              <>
                <h2 className="text-3xl sm:text-5xl font-semibold">
                  {postDetails?.postTitle}
                </h2>
                {postDetails?.shortDescription && (
                  <p>{postDetails?.shortDescription}</p>
                )}
                <AspectRatio
                  ratio={6 / 3}
                  className="rounded-2xl border overflow-hidden"
                >
                  <img
                    src={postDetails?.thumb}
                    className="w-full object-cover h-full"
                  />
                </AspectRatio>
                <p
                  className="blogDetails !font-2"
                  dangerouslySetInnerHTML={{ __html: postDetails?.content }}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetails;
