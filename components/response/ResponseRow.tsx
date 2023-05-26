import { useSupabaseClient } from "@supabase/auth-helpers-react";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TaskInstance, User } from "../../lib/types";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { ThreeDots } from "react-loader-spinner";

const ResponseRow = ({ person }: { person: User }) => {
  const [response, setResponse] = useState<TaskInstance>();
  const [open, setOpen] = useState(false);
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = useSupabaseClient();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("responses")
          .select("*")
          .eq("task_parent_id", router.query.id)
          .eq("user_id", person.id);

        if (error) throw error;

        setResponse(data[0] as TaskInstance);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <tr key={person.id}>
        <td className="whitespace-nowrap truncate max-w-[250px] px-3 py-4 text-sm text-gray-900 font-medium">
          {person.email}
        </td>
        <td className="whitespace-nowrap px-3 py-4">
          {!response && loading ? (
            <ThreeDots
              height="16"
              width="16"
              radius="9"
              color="#000"
              ariaLabel="three-dots-loading"
              visible={true}
            />
          ) : response ? (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
              Submitted
            </span>
          ) : (
            <span className="px-2  inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
              Not Submitted
            </span>
          )}
        </td>
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
          <button
            disabled={!response}
            onClick={onOpen}
            className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
          >
            View
          </button>
        </td>
      </tr>
      {createPortal(
        <Modal open={open} closeModal={onClose} title="Task Response" scroll>
          <p className="text-xs mt-1">
            <span className="text-gray-500">Responded on: </span>
            <span className="font-medium text-gray-600">
              {dayjs(response?.created_at).format("MMMM D, YYYY h:mm A")}
            </span>
          </p>

          <div className="mt-4">
            {response?.body.map((item, i) => (
              <div className="mb-2" key={i}>
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  {item.title}
                </label>
                {item.type === "string" ? (
                  <textarea
                    disabled
                    rows={3}
                    value={item.response as string}
                    className="relative w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline placeholder:text-gray-400 bg-white pl-3 pr-10 text-left focus-visible:border-indigo-500 focus-visible:ring-0 sm:text-sm disabled:opacity-50"
                  />
                ) : (
                  <input
                    disabled
                    type="checkbox"
                    checked={item.response as boolean}
                  />
                )}
              </div>
            ))}
          </div>
          <Button loading={false} onClick={onClose}>
            Ok
          </Button>
        </Modal>,
        document.body
      )}
    </>
  );
};

export default ResponseRow;
