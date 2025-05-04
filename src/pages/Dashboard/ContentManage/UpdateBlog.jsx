import React, { useState, useRef, useMemo, useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Input from "@/components/ui/Input";
import { useForm } from "react-hook-form";
import LineError from "@/components/ui/LineError";
import generatePermalink from "@/hooks/AutoGenaretPermalLink";
import JoditEditor from "jodit-react";
import { AuthContext } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageFrame from "@/assets/image.png";
import { TfiClose } from "react-icons/tfi";
import toast from "react-hot-toast";
import Upload from "@/hooks/upload";
import imageCompression from "browser-image-compression";
import { axiosSecure } from "@/hooks/axiosSecure";
import Swal from "sweetalert2";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PiSpinnerGapBold, PiSpinnerGapThin } from "react-icons/pi";
import { toolbarOptions } from "./AddBlog";
import { useQuery } from "@tanstack/react-query";
import NotFound from "@/pages/NotFound";

const AddBlog = () => {
  const { authData } = useContext(AuthContext);
  const [isSaving, setisSaving] = useState();
  const [status, setstatus] = useState();
  const [readTimeAvg, setreadTimeAvg] = useState(0);
  const [content, setcontent] = useState();

  // Vars
  const { id } = useParams();

  // State
  const [thumb, setthumb] = useState();
  const [postPermalLinkAuto, setpostPermalLinkAuto] = useState("");

  // handel Is Image upload
  const HandelImageUpload = async (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type !== "image/webp" &&
      file.type !== "image/png" &&
      file.type !== "image/jpeg"
    ) {
      toast.error("Webp, Png, Jpeg format image");
      return;
    }
    const compressOption = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1000,
      useWebWorker: true,
    };
    const filCompressed = await imageCompression(file, compressOption);
    const { secure_url } = await Upload(filCompressed);
    setthumb(secure_url);
  };

  // React hook form
  const {
    register: formFields,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  // React Watch
  const postTitle = watch("postTitle", "");
  const postDes = watch("postDes", "");

  // Valid Input
  const handelTitleInput = (e) => {
    const maxLength = 120;
    const value = e.target.value;

    if (value.length <= maxLength) {
      setValue("postTitle", value);
    } else {
      setValue("postTitle", value.slice(0, maxLength));
    }
  };

  const handleDescriptionInput = (e) => {
    const maxLength = 400;
    const value = e.target.value;

    if (value.length > maxLength) {
      setValue("postDes", value.slice(0, maxLength));
    }
  };

  // Auto Genaret permal link
  const HandelGenaretPermalLink = async (e) => {
    const permalLink = await generatePermalink(postTitle);
    setpostPermalLinkAuto(permalLink);
  };

  // Set all post details default data
  const setPostDetails = (data) => {
    setValue("postTitle", data?.postTitle);
    setValue("postDes", data?.shortDescription);
    setthumb(data?.thumb);
    setreadTimeAvg(data?.timeToRead);
    setstatus(data?.status);
    setcontent(data?.content);
    setpostPermalLinkAuto(data?.permaLink);
  };

  // Editor
  const config = useMemo(
    () => ({
      readonly: false,
      height: 600,
      buttons: toolbarOptions,
      placeholder: "",
    }),
    []
  );

  const handleEditorChange = (newContent) => {
    setcontent(newContent);
    contentWordCount(newContent);
    setValue("content", newContent);
  };

  const contentWordCount = (text) => {
    const plainText = text.replace(/<[^>]*>/g, "").trim();
    const count = plainText ? plainText.split(/\s+/).length : 0;
    const readingTimeInSeconds = (count / 200) * 60;
    const readingTimeInMinutes = readingTimeInSeconds / 60;
    setreadTimeAvg(readingTimeInMinutes?.toFixed(1));
  };

  // Const fetch blog details by tanstack
  const fetchPostData = async () => {
    const { data } = await axiosSecure.get(`/blog/post/details?postId=${id}`);
    setPostDetails(data);
    return data;
  };

  const {
    data: postDetails,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["postDetails"],
    queryFn: fetchPostData,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Handel Post Update
  const HandelPostUpdate = (data) => {
    const updateData = {
      postTitle: data?.postTitle,
      permaLink: postPermalLinkAuto,
      thumb: thumb,
      status: status,
      shortDescription: postDes,
      content: content,
      timeToRead: readTimeAvg,
    };

    Swal.fire({
      title: "Are you sure?",
      icon: "question",
      text: "Sure you want to update post",
      showCancelButton: true,
      confirmButtonText: "Update",
    }).then(async (res) => {
      if (!res?.isConfirmed) {
        return;
      }
      setisSaving(true);

      await axiosSecure
        .patch(
          `/blog/post/update?id=${postDetails?._id}&uid=${authData?.uid}`,
          updateData
        )
        .then((res) => {
          refetch();
          Swal.fire({
            title: "Update Succesfull",
            icon: "success",
            text: "Posted updated succesfully",
            confirmButtonText: "Close",
          });
        })
        .finally(() => {
          setisSaving(false);
        });
      setisSaving(false);
    });
  };

  if (isLoading) {
    return (
      <>
        <div
          className={`w-full rounded-xl h-screen items-center flex justify-center`}
        >
          <PiSpinnerGapThin size={100} className="animate-spin text-red-500" />
        </div>
      </>
    );
  }

  if (error) {
    return <NotFound />;
  }
  return (
    <>
      <Helmet>
        <title>
          Update - {postDetails?.postTitle || "Loading"} | Donor. Flow
        </title>
      </Helmet>
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>Dashboard</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Content management</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Update</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{postDetails?.postTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <motion.form
        onSubmit={handleSubmit(HandelPostUpdate)}
        initial={{ translateY: 200, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        className="rounded-xl w-full justify-center flex flex-col xl:flex-row gap-10"
      >
        <div className="bg-white w-full rounded-lg p-5 space-y-5">
          <div>
            <div className="flex justify-between w-full">
              <label className="block mb-1 font-semibold text-neutral-800">
                Title *
              </label>
              <p>({postTitle?.length}/120)</p>
            </div>
            <Input
              disabled={isSaving}
              {...formFields("postTitle", {
                required: "Title is required",
              })}
              onChange={async (e) => {
                await handelTitleInput(e);
                HandelGenaretPermalLink(e);
              }}
              placeholder=""
            />
            {errors.postTitle && <LineError error={errors.postTitle.message} />}
          </div>
          <div>
            <Input
              disabled={isSaving}
              value={`/${postPermalLinkAuto}`}
              readOnly
              label="Permalink *"
            />
            <p className="text-sm pt-2">
              Link preview:{" "}
              <strong className="text-sm font-normal text-red-500">
                <Link
                  target="_blank"
                  to={`https://${window.location.hostname}/blogs/${postPermalLinkAuto}`}
                >
                  https://{window.location.hostname}/blogs/{postPermalLinkAuto}
                </Link>
              </strong>
            </p>
          </div>
          <div>
            <div className="flex justify-between w-full">
              <label className="block mb-1 font-semibold text-neutral-800">
                Description
              </label>
              <p>({postDes?.length}/400)</p>
            </div>
            <span className="w-10 h-[1px] bg-red-600/40 flex mb-[10px] rounded-full"></span>
            <textarea
              disabled={isSaving}
              rows={4}
              {...formFields("postDes")}
              onInput={handleDescriptionInput}
              placeholder=""
              className="p-2 text-sm border focus:border-red-400/50 focus:ring-4 transition-all ring-red-100 w-full rounded-md"
            ></textarea>
            {errors.postDes && <LineError error={errors.postDes.message} />}
          </div>
          <div>
            <label className="block mb-1 font-semibold text-neutral-800">
              Content
            </label>
            <span className="w-10 h-[1px] bg-red-600/40 flex mb-[10px] rounded-full"></span>
            <JoditEditor
              disabled={isSaving}
              value={content}
              config={config}
              tabIndex={1}
              className="w-full"
              onChange={(newContent) => handleEditorChange(newContent)}
            />
          </div>
        </div>
        <div className="xl:w-[400px] space-y-5 w-full flex flex-col">
          <div className="p-5 rounded-lg bg-white order-last xl:order-first">
            <label className="mb-1 font-semibold flex w-full justify-between text-neutral-800">
              Publish
              <Link
                to={`/blogs/${postDetails?.permaLink}`}
                className="underline text-red-500"
              >
                Preview
              </Link>
            </label>
            <span className="w-10 h-[1px] bg-red-600/40 flex mb-[10px] rounded-full"></span>
            <button
              type="submit"
              className="mt-2 flex justify-center gap-2 items-center px-5 w-full bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-700 border border-red-500 transition-all hover:ring-4 ring-red-200 hover:bg-transparent hover:text-red-500"
            >
              Update
              {isSaving && (
                <PiSpinnerGapBold size={20} className={`animate-spin`} />
              )}
            </button>
          </div>
          <div className="p-5 rounded-lg bg-white">
            <label className="block mb-1 font-semibold text-neutral-800">
              Time to read (minute)
            </label>
            <span className="w-10 h-[1px] bg-red-600/40 flex mb-[10px] rounded-full"></span>
            <div className="px-3 py-2 border text-sm rounded-md bg-slate-100">
              {readTimeAvg || 0}
            </div>
          </div>
          {authData?.role === "admin" && (
            <div className="p-5 rounded-lg bg-white">
              <label className="block mb-1 font-semibold text-neutral-800">
                Status
              </label>
              <span className="w-10 h-[1px] bg-red-600/40 flex mb-[10px] rounded-full"></span>
              <Select
                onValueChange={(e) => setstatus(e)}
                defaultValue={"published"}
                {...(status && { value: status })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="p-5 rounded-lg bg-white">
            <label className="block mb-1 font-semibold text-neutral-800">
              Image *
            </label>
            <span className="w-10 h-[1px] bg-red-600/40 flex mb-[10px] rounded-full"></span>
            <input
              onChange={HandelImageUpload}
              className="hidden"
              accept=".webp, .png, .jpg, .jpeg"
              id="thumb"
              type="file"
            />
            {thumb && (
              <div className="-mt-10 z-40 translate-y-16 flex relative ml-2">
                <button
                  type="button"
                  onClick={() => setthumb(false)}
                  className="bg-neutral-100 p-2 border rounded-full"
                >
                  <TfiClose />
                </button>
              </div>
            )}
            <label htmlFor="thumb" className="w-fit flex flex-col pt-5">
              <div
                style={{ backgroundImage: `url('${thumb || ImageFrame}')` }}
                className="w-40 bg-center bg-cover bg-no-repeat cursor-pointer h-40 border rounded-md"
              ></div>
            </label>
          </div>
        </div>
      </motion.form>
    </>
  );
};

export default AddBlog;
