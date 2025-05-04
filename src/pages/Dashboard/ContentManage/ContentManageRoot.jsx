import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { axiosSecure } from "@/hooks/axiosSecure";
import { AuthContext } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import moment from "moment";
import { CiEdit, CiSearch, CiTrash } from "react-icons/ci";
import { ImSpinner11 } from "react-icons/im";
import { PiEyeThin } from "react-icons/pi";
import Label from "@/components/Label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SlArrowDown } from "react-icons/sl";
import { GoPlus } from "react-icons/go";
import Input from "@/components/ui/Input";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContentManageRoot = () => {
  const [currentPage, setcurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState();
  const [isDeleting, setisDeleting] = useState();
  const [filter, setfilter] = useState("all");
  const [searchQuery, setsearchQuery] = useState("");

  const { authData } = useContext(AuthContext);

  const fetchAllData = async () => {
    const { data } = await axiosSecure.get(
      `/blogs/all/paginated?page=${totalPages}&limit=10&uid=${authData?.uid}&search=${searchQuery}`
    );
    settotalPages(data?.totalPages);
    return data;
  };

  const {
    data: allBlogs,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allBlogs", currentPage, searchQuery],
    queryFn: fetchAllData,
  });

  const HandelDelete = async (post) => {
    Swal.fire({
      title: `Are you sure?`,
      icon: "question",
      text: `Are you sure? you want to delete this post`,
      confirmButtonText: "Delete",
      showCancelButton: true,
    }).then((res) => {
      if (!res.isConfirmed) {
        return;
      }
      setisDeleting(true);

      axiosSecure
        .delete(`/blog/delete?uid=${authData?.uid}&id=${post?._id}`)
        .then(() => {
          refetch();
          Swal.fire({
            icon: "success",
            title: `Post deleted succes!`,
            text: "Tap close button to close this modal",
            confirmButtonText: "Close",
          });
        })
        .finally(() => {
          setisDeleting(false);
        });
    });
  };

  const SetStatus = async (type, post) => {
    if (authData?.role !== "admin") {
      toast.error("Something went wrong");
      return;
    }
    const statusIs = type ? "published" : "draft";

    Swal.fire({
      title: `${type ? "Publish" : "Draft"} this post`,
      icon: "question",
      text: `Are you sure? you want to ${type ? "Publish" : "Unpublish"}`,
      confirmButtonText: "Yes!",
      showCancelButton: true,
    }).then((res) => {
      if (!res.isConfirmed) {
        return;
      }
      axiosSecure
        .patch(`/blog/post/update?id=${post?._id}&uid=${authData?.uid}`, {
          status: statusIs,
        })
        .then(() => {
          refetch();
          Swal.fire({
            icon: "success",
            title: `Post succesfully ${type ? "Published" : "Unpublished"}`,
            text: "Tap close button to close this modal",
            confirmButtonText: "Close",
          });
        });
    });
  };
  return (
    <>
      <Helmet>
        <title>All Blogs | Donor. Flow</title>
      </Helmet>
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>Dashboard</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Content management</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <motion.div
        initial={{ opacity: 0, translateY: 200 }}
        animate={{ opacity: 1, translateY: 0 }}
        className="bg-white p-5 rounded-md"
      >
        <div className="flex w-full justify-between items-center flex-col sm:flex-row">
          <div className="flex w-full flex-col sm:flex-row sm:w-fit items-center gap-5">
            <Input
              onChange={(e) => setsearchQuery(e.target.value)}
              className="border-b-0 w-full rounded-b-none md:w-[300px]"
              placeholder=""
            />
            <CiSearch size={25} className="-ml-[30%] bg-white" />
          </div>
          <div className="flex justify-between items-center w-full sm:w-fit">
            <Link to={`./add-blog`} className="w-full">
              <button className="px-5 py-2 flex items-center gap-2 w-full bg-red-500 text-white font-2 sm:rounded-t-md hover:bg-red-800">
                Create Post <GoPlus />
              </button>
            </Link>
          </div>
        </div>
        <ScrollArea className="w-full pb-3">
          <Table id="tableDonation" className="min-w-[1640px] xl:min-w-full">
            <TableHeader className="font-semibold bg-red-100">
              <TableRow>
                <TableHead className="w-[150px]">Image</TableHead>
                <TableHead className="w-[300px]">Name</TableHead>
                <TableHead className="w-[400px]">Short Description</TableHead>
                <TableHead className="w-40">Time to read</TableHead>
                <TableHead className="w-40">Created At</TableHead>
                <TableHead data-html2canvas-ignore className="w-[10px]">
                  Edit
                </TableHead>
                {authData?.role === "admin" && (
                  <TableHead data-html2canvas-ignore className="w-[10px]">
                    Delete
                  </TableHead>
                )}
                <TableHead data-html2canvas-ignore className="w-[10px]">
                  View
                </TableHead>
                <TableHead className="text-right w-[200px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allBlogs &&
                !isLoading &&
                allBlogs?.blogs
                  .filter((post) => {
                    if (filter === "all") return true;
                    return post?.status === filter;
                  })
                  .map((post, index) => (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell>
                          <Link to={`./update-blog/${post?._id}`}>
                            <img
                              src={post?.thumb}
                              className="border hover:object-left-bottom transition-all rounded-lg object-cover"
                              style={{ width: "100px", height: "100px" }}
                              alt={post?.postTitle}
                            />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link to={`./update-blog/${post?._id}`}>
                            <h3 className="underline">{post?.postTitle}</h3>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <h3>
                            {post?.shortDescription?.slice(0, 120) ||
                              "not provided"}
                          </h3>
                        </TableCell>
                        <TableCell>{post?.timeToRead}m</TableCell>
                        <TableCell>
                          {moment(post?.createdAt).fromNow()}
                        </TableCell>
                        <TableCell data-html2canvas-ignore>
                          <Link to={`./update-blog/${post?._id}`}>
                            <button className="bg-green-400 p-2 rounded-lg hover:bg-green-600 transition-all hover:text-white">
                              <CiEdit size={20} />
                            </button>
                          </Link>
                        </TableCell>
                        {authData?.role === "admin" && (
                          <TableCell data-html2canvas-ignore>
                            <button
                              onClick={() => HandelDelete(post)}
                              className="bg-red-400 p-2 rounded-lg hover:bg-red-600 transition-all text-white"
                            >
                              {isDeleting ? (
                                <ImSpinner11
                                  size={20}
                                  className="animate-spin"
                                />
                              ) : (
                                <CiTrash size={20} />
                              )}
                            </button>
                          </TableCell>
                        )}
                        <TableCell data-html2canvas-ignore>
                          <Link to={`../../blogs/${post?.permaLink}`}>
                            <button className="bg-sky-400 p-2 rounded-lg hover:bg-sky-600 transition-all text-white">
                              <PiEyeThin size={20} />
                            </button>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">
                          {authData?.role === "admin" ? (
                            <Popover>
                              <PopoverTrigger>
                                <span
                                  className={`${
                                    post?.status === "draft"
                                      ? "bg-yellow-400"
                                      : "bg-sky-600 text-white"
                                  } pl-3 gap-2 items-center cursor-pointer rounded-full flex overflow-hidden`}
                                >
                                  <span className="py-1">{post?.status}</span>
                                  <SlArrowDown
                                    size={25}
                                    className={`${
                                      post?.status === "draft"
                                        ? "bg-yellow-500"
                                        : "bg-sky-800 text-white"
                                    } p-2`}
                                  />
                                </span>
                              </PopoverTrigger>
                              <PopoverContent className="!shadow-none text-sm flex flex-col p-0 hover:bg-slate-100 items-start text-start mr-6 mt-2 border-red-200 w-[130px]">
                                {post?.status === "published" ? (
                                  <button
                                    className="px-4 py-2 cursor-pointer w-full text-start"
                                    onClick={() => SetStatus(false, post)}
                                  >
                                    Unpublish
                                  </button>
                                ) : (
                                  <button
                                    className="px-4 py-2 cursor-pointer w-full text-start"
                                    onClick={() => SetStatus(true, post)}
                                  >
                                    Publish
                                  </button>
                                )}
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <div className="w-full flex justify-end">
                              <Label
                                className={`w-fit ${
                                  post?.status !== "draft" && "!bg-blue-500"
                                } font-medium`}
                              >
                                {post?.status}
                              </Label>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
              {isLoading &&
                [...Array(6)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="w-full h-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-10" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-full h-10" />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {allBlogs?.blogs?.length > 0 &&
            !isLoading &&
            allBlogs?.blogs?.filter((post) => {
              if (filter === "all") return true;
              return post?.status === filter;
            }).length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-start py-5">
                  No donations found for the selected filter.
                </TableCell>
              </TableRow>
            )}
          {allBlogs?.blogs?.length <= 0 && (
            <div className="py-5 px-5">No blood blog posts record found</div>
          )}
          <div className="w-full flex items-center gap-3 px-2 pt-2">
            {isLoading &&
              [...Array(10)].map((_, index) => (
                <Skeleton key={index} className={`rounded-md p-4`} />
              ))}
            {!isLoading &&
              [...Array(totalPages)].map((_, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => setcurrentPage(index + 1)}
                  className={`p-2 border rounded-md px-4 ${
                    currentPage === index + 1 && "bg-red-50 text-red-500"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            <div className="flex items-center w-full justify-between">
              <h3>Showing result {allBlogs?.blogs?.length} of 10</h3>
              <Select onValueChange={(e) => setfilter(e)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </motion.div>
    </>
  );
};

export default ContentManageRoot;
