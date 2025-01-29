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
import { Link, useNavigate } from "react-router-dom";
import { PiSpinnerGapBold } from "react-icons/pi";

const AddBlog = () => {
  const [content, setContent] = useState("");
  const [isSaving, setisSaving] = useState();
  const editor = useRef(null);
  const { authData } = useContext(AuthContext);
  const [thumb, setthumb] = useState();
  const [status, setstatus] = useState();
  const [postPermalLinkAuto, setpostPermalLinkAuto] = useState("");
  const [readTimeAvg, setreadTimeAvg] = useState(0);
  const navigate = useNavigate();
  const {
    register: formFields,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  const postTitle = watch("postTitle", "");
  const postDes = watch("postDes", "");
  const readTimeAvgWatch = watch("readTime", "");

  const handleDescriptionInput = (e) => {
    const maxLength = 400;
    const value = e.target.value;

    if (value.length > maxLength) {
      setValue("postDes", value.slice(0, maxLength));
    }
  };

  const handelTitleInput = (e) => {
    const maxLength = 120;
    const value = e.target.value;

    if (value.length <= maxLength) {
      setValue("postTitle", value);
    } else {
      setValue("postTitle", value.slice(0, maxLength));
    }
  };

  const HandelGenaretPermalLink = async (e) => {
    const permalLink = await generatePermalink(postTitle);
    setpostPermalLinkAuto(permalLink);
  };
  const config = useMemo(
    () => ({
      readonly: false,
      height: 600,
      buttons: toolbarOptions,
      placeholder: "Type here...",
    }),
    []
  );

  const handleEditorChange = (newContent) => {
    setContent(newContent);
    contentWordCount(newContent);
    setValue("content", newContent);
  };

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

  const HandelPostSave = async (data) => {
    if (!postPermalLinkAuto) {
      toast.error("Enter a valid blog permal link");
      return;
    }
    if (!thumb) {
      toast.error("Upload blog thumbnail");
      return;
    }

    setisSaving(true);

    const formData = {
      postTitle: data?.postTitle,
      permaLink: postPermalLinkAuto,
      thumb: thumb,
      status: status || "draft",
      shortDescription: postDes,
      content: content,
      timeToRead: readTimeAvg || 0,
    };

    axiosSecure
      .post(`/blog/create?uid=${authData?.uid}`, formData)
      .then((res) => {
        reset();
        setthumb("");
        setContent("");
        setstatus("");
        Swal.fire({
          title: "Blog created succesfully",
          icon: "success",
          text: "Your blog suces fully created and posted",
          confirmButtonText: "Close",
        });
        navigate(`../content-management/update-blog/${res?.data?._id}`);
      })
      .catch((err) => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setisSaving(false);
      });
  };

  const contentWordCount = (text) => {
    const plainText = text.replace(/<[^>]*>/g, "").trim();
    const count = plainText ? plainText.split(/\s+/).length : 0;
    const readingTimeInSeconds = (count / 200) * 60;
    const readingTimeInMinutes = readingTimeInSeconds / 60;
    setreadTimeAvg(readingTimeInMinutes?.toFixed(1));
  };

  useEffect(() => {
    if (authData?.role === "admin" && status !== "published") {
      setstatus("published");
    } else if (status !== "draft") {
      setstatus("draft");
    }
    setValue("readTime", readTimeAvgWatch);
  }, [authData, readTimeAvgWatch]);

  return (
    <>
      <Helmet>
        <title>Add new blog | Donor. Flow</title>
      </Helmet>
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>Dashboard</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Content management</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Add blog</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <motion.form
        onSubmit={handleSubmit(HandelPostSave)}
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
              placeholder="Post Title"
              onBlur={(e) => {
                HandelGenaretPermalLink(e);
                handelTitleInput(e);
              }}
            />
            {errors.postTitle && <LineError error={errors.postTitle.message} />}
          </div>
          <div>
            <Input
              disabled={isSaving}
              label="Permalink *"
              value={`/${postPermalLinkAuto}`}
              readOnly
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
              placeholder="Short description"
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
              ref={editor}
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
            <label className="block mb-1 font-semibold text-neutral-800">
              Publish
            </label>
            <span className="w-10 h-[1px] bg-red-600/40 flex mb-[10px] rounded-full"></span>
            <button
              disabled={isSaving}
              type="submit"
              className="mt-2 flex justify-center gap-2 items-center px-5 w-full bg-red-500 text-white py-2 rounded-lg font-medium hover:bg-red-700 border border-red-500 transition-all hover:ring-4 ring-red-200 hover:bg-transparent hover:text-red-500"
            >
              Save
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

export const toolbarOptions = [
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "eraser",
  "ul",
  "ol",
  "fontsize",
  "paragraph",
  "lineHeight",
  "superscript",
  "subscript",
  "classSpan",
  "file",
  "image",
  "video",
  "spellcheck",
  "speechRecognize",
  "cut",
  "copy",
  "paste",
  "selectall",
  "copyformat",
  "hr",
  "table",
  "link",
  "symbols",
  "ai-commands",
  "indent",
  "outdent",
  "left",
  "brush",
  "undo",
  "redo",
  "find",
  "source",
  "fullsize",
  "preview",
  "print",
];
