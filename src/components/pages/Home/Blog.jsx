import TitleAndDes from "@/components/TitleAndDes";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import LineBrack from "@/components/ui/LineBrack";
import { axiosSecure } from "@/hooks/axiosSecure";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const Blog = () => {
  const {
    data: allPosts,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/blog/post/all");
      return data;
    },
  });

  return (
    <>
      <TitleAndDes
        title={
          <>
            The Power of Giving Blood <LineBrack /> Donation Stories
          </>
        }
      >
        Discover inspiring stories and helpful information on how blood donation
        <LineBrack /> saves lives and how you can make a difference
      </TitleAndDes>
      <section className="flex justify-center w-full">
        <div className="px-5 pt-20 w-primary  gap-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {allPosts &&
            allPosts?.blogs?.map((post, index) => (
              <motion.article
                key={post?.postTitle}
                initial={{ opacity: 0, translateY: 250 }}
                whileInView={{ opacity: 1, translateY: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="col-span-1 space-y-5 flex flex-col"
              >
                <Link
                  to={`./blogs/${post?.permaLink}`}
                  className="flex flex-col gap-5"
                >
                  <AspectRatio
                    ratio={3 / 2}
                    src={post?.thumb}
                    className="object-cover overflow-hidden !rounded-2xl"
                    alt={post?.postTitle}
                  >
                    <img
                      src={post?.thumb}
                      alt="Image"
                      className="rounded-xl h-full w-full hover:scale-110 transition-all duration-500 object-cover"
                    />
                    <div className="backdrop-blur bg-white ml-5 p-2 px-3 w-fit font-semibold rounded-md -mt-20 scale-90 text-xl font-1 border">
                      {post?.timeToRead}
                      <br />
                      <span className="text-xs font-light -mt-1 flex">min</span>
                    </div>
                  </AspectRatio>
                  <h2 className="text-xl font-semibold transition-all duration-700 hover:text-red-500">
                    {post?.postTitle}
                  </h2>
                </Link>
                {post?.shortDescription?.length > 0 && (
                  <p>{post?.shortDescription?.slice(0, 120)}</p>
                )}
                <div className="flex justify-between">
                  <p className="px-2 py-1 bg-white/50 border border-red-200 w-fit rounded-md">
                    {moment(post?.createdAt).fromNow()}
                  </p>
                  <Link
                    to={"/blogs"}
                    className="flex cursor-pointer justify-center items-center px-2 py-1 bg-white/50 border border-red-200 w-fit rounded-md"
                  >
                    See More...
                  </Link>
                </div>
              </motion.article>
            ))}
          {isLoading &&
            [...Array(3)].map((_, index) => (
              <div key={index} className="col-span-1 space-y-5 flex flex-col">
                <div className="flex flex-col gap-5">
                  <AspectRatio
                    ratio={3 / 2}
                    className="object-cover overflow-hidden !rounded-2xl"
                  >
                    <Skeleton className={`w-full h-full`} />
                  </AspectRatio>
                  <div className="text-xl font-semibold transition-all duration-700 hover:text-red-500">
                    <Skeleton className={`w-full py-5`} />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className={`w-full p-2`} />
                    <Skeleton className={`w-9/12 p-2`} />
                  </div>
                </div>
                <Skeleton className={`w-5/12 p-4`} />
              </div>
            ))}
        </div>
      </section>
      <div className="flex justify-center py-20 pt-10 px-5">
        <Link data-aos="fade-up" to={"../blogs"}>
          <button className="bg-black text-white font-semibold px-5 py-3 rounded-xl">
            Browse more
          </button>
        </Link>
      </div>
    </>
  );
};

export default Blog;
