import { axiosSecure } from "./axiosSecure";

const generatePermalink = async (input) => {
  const permalLinkOp = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  const { data } = await axiosSecure.get(
    `/auth/verify/permallink?link=${permalLinkOp}`
  );
  return data?.permaLink;
};
export default generatePermalink;
