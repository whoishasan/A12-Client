import { AspectRatio } from "@/components/ui/aspect-ratio";
import LineBrack from "@/components/ui/LineBrack";
import { axiosSecure } from "@/hooks/axiosSecure";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useRef, useState } from "react";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { FollowUs } from "@/components/Footer";
import { HiOutlineEnvelope } from "react-icons/hi2";
import SubscribeEmal from "@/hooks/SubscribeEmal";

const Blogs = () => {
  const [limit, setlimit] = useState(5);
  const searchRef = useRef();

  const fetchAllPost = async () => {
    const { data } = await axiosSecure.get(
      `/blog/post/all?limit=${limit}&search=${searchRef?.current.value}`
    );
    return data;
  };

  const {
    data: allPosts,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allPosts", limit],
    queryFn: fetchAllPost,
  });

  return (
    <>
      <section className="flex justify-center py-10 pb-0">
        <div className="w-primary px-5 flex flex-col pb-10 pt-40 border-dashed border-b gap-8 border-b-gray-900 mb-10">
          <h2
            data-aos="fade-up"
            className="text-4xl md:text-5xl font-medium font-2"
          >
            Discorver our latest
            <LineBrack /> <strong className="text-red-500">blog</strong> posts
          </h2>
          <p data-aos="fade-up">
            Discover the impact of blood donation, inspiring stories, and how
            you can be a hero in someone's life. Join us,
            <LineBrack /> in spreading awareness and saving lives through the
            gift of blood
          </p>
        </div>
      </section>
      <section className="flex justify-center -mb-20">
        <div className="w-primary px-5 gap-5 flex flex-col-reverse xl:flex-row justify-between">
          <div className="w-full xl:w-9/12 border-dashed flex flex-col gap-8 xl:border-r border-gray-900">
            {allPosts?.blogs?.map((post, index) => (
              <motion.article
                initial={{ opacity: 0, translateY: 200 }}
                whileInView={{
                  opacity: 1,
                  translateY: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
                key={index}
                className="flex gap-5 flex-col min-[600px]:flex-row items-center "
              >
                <Link
                  to={`./${post?.permaLink}`}
                  className="w-full min-[600px]:w-4/12"
                >
                  <AspectRatio
                    ratio={3 / 3}
                    className="rounded-xl overflow-hidden"
                  >
                    <img
                      src={post.thumb}
                      loading="lazy"
                      className="w-full duration-500 hover:scale-125 transition-all hover:rotate-12 h-full object-cover"
                      alt={post?.postTitle}
                    />
                  </AspectRatio>
                </Link>
                <div className=" sm:p-5 w-full min-[600px]:w-8/12 space-y-5">
                  <Link
                    to={`./${post?.permaLink}`}
                    className="text-xl transition-all hover:text-red-500 sm:text-2xl font-2"
                  >
                    {post?.postTitle}
                  </Link>
                  {post?.shortDescription && (
                    <p>{post?.shortDescription?.slice(0, 120)}</p>
                  )}
                  <p>
                    {post?.timeToRead}m read -{" "}
                    {moment(post?.createdAt).fromNow()} posted
                  </p>
                  <Link
                    className="flex border-b-[1px] group items-center gap-2 w-fit border-black/20"
                    to={`./${post?.permaLink}`}
                  >
                    Read post{" "}
                    <IoIosArrowRoundForward
                      size={20}
                      className="text-neutral-700 group-hover:translate-x-2 transition-all"
                    />
                  </Link>
                </div>
              </motion.article>
            ))}
            {isLoading &&
              [...Array(5)].map((_, index) => (
                <div
                  key={`loader-${index}`}
                  className="flex gap-5 items-center"
                >
                  <div className="w-4/12">
                    <AspectRatio
                      radioGroup=""
                      className="rounded-xl overflow-hidden"
                    >
                      <Skeleton className="w-full h-full object-cover" />
                    </AspectRatio>
                  </div>
                  <div className="sm:p-5 w-8/12 space-y-5">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                  </div>
                </div>
              ))}
            <motion.div
              initial={{ opacity: 0, translateY: 200 }}
              whileInView={{
                opacity: 1,
                translateY: 0,
              }}
              transition={{
                duration: 0.4,
              }}
              className="w-full sm:pr-5"
            >
              {allPosts && allPosts?.blogs?.length !== allPosts?.blogsCount ? (
                <button
                  onClick={() => setlimit(limit + 5)}
                  className="mt-5 w-full bg-black py-3 rounded-xl text-white font-semibold"
                >
                  Load more posts
                </button>
              ) : (
                <p className="text-lg p-5 py-3 border-gray-900 bg-gray-900/10 text-gray-900 border">
                  No more blogs post was found
                </p>
              )}
            </motion.div>
          </div>
          <div className="w-full xl:w-4/12 space-y-8">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                refetch();
              }}
              className="w-full flex p-2 border-gray-900  border"
            >
              <input
                ref={searchRef}
                placeholder="Search post"
                className="w-full  bg-transparent p-3 placeholder:text-gray-900"
              />
              <button className="px-5 py-3 bg-gray-900 text-white font-medium">
                Search
              </button>
            </form>
            <ul className="hidden xl:block">
              <h3 className="text-xl font-2">Follow us on</h3>
              <span className="flex w-2/12 my-2 h-[1px] bg-gray-900"></span>
              {FollowUs &&
                FollowUs.map((li, index) => (
                  <Link className="flex py-2" key={li?.name} to={li?.path}>
                    <button className="border flex items-center justify-start gap-5 text-gray-900 px-5 py-3 hover:bg-gray-900 hover:text-white transition-all w-full border-gray-900 rounded-md">
                      <span className="text-xl">{li?.icon}</span>
                      {li?.name}
                    </button>
                  </Link>
                ))}
            </ul>
            <ul className="hidden xl:block">
              <h3 className="text-xl font-2">Newsletter</h3>
              <span className="flex w-2/12 my-2 h-[1px] bg-gray-900"></span>
              <div className="bg-gray-900 space-y-5 text-white p-5 mt-4 rounded-md">
                <HiOutlineEnvelope
                  size={50}
                  className="bg-white/10 p-2 rounded-md"
                />
                <h3 className="text-3xl font-semibold">
                  Subscribe to our
                  <br /> newsletter
                </h3>
                <p>
                  Get the latest updates and insights straight to your inbox.
                  Join now and never miss out!
                </p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    SubscribeEmal(e.target.email.value);
                  }}
                  className="w-full flex p-2 border-white  border"
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="w-full  bg-transparent p-3 placeholder:text-white"
                  />
                  <button className="px-5 py-3 bg-white text-gray-900 font-medium">
                    Susbribe
                  </button>
                </form>
              </div>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blogs;
