import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { TaskInstance, TaskWithProject } from "../../../lib/types";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";

type Props = {
  task: TaskWithProject;
};

const UserTaskRow: React.FC<Props> = ({ task }) => {
  const [response, setResponse] = useState<TaskInstance>();
  const [body, setBody] = useState(
    task.body.map((b) => ({ ...b, response: b.type === "string" ? "" : false }))
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const supabase = useSupabaseClient();
  const user = useUser();

  const handleRespond = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (!user) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("responses")
        .insert([
          {
            task_parent_id: task.id,
            user_id: user?.id,
            body: body,
          },
        ])
        .select("id");

      if (error) throw error;

      setResponse({
        body,
        created_at: new Date(),
        id: data[0]?.id,
        task_parent_id: task.id,
        user_id: user.id,
      });

      setLoading(false);
      onClose();
      toast.success("Response submitted!");
    } catch (err) {
      console.error(err);
      toast.error("Error submitting response");
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("responses")
        .select("*")
        .eq("task_parent_id", task.id)
        .eq("user_id", user?.id);

      if (error) throw error;

      setResponse(data[0] as TaskInstance);
    })();
  }, []);

  return (
    <>
      <tr key={task.id}>
        <td className="whitespace-nowrap capitalize px-3 py-4 text-sm text-gray-900 font-medium">
          {task.name}
        </td>
        <td className="break-words max-w-[150px] px-3 py-4 text-sm text-gray-500">
          {task.description}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {task.project_id.name}
        </td>
        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
          {task.project_id.assigned_group?.name ||
            task.project_id.assigned_user?.email}
        </td>
        <td className="whitespace-nowrap px-3 py-4">
          {response ? (
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
            onClick={onOpen}
            className="text-indigo-600 hover:text-indigo-900"
          >
            {response ? "View" : "Submit"}
          </button>
        </td>
      </tr>
      <Modal open={open} closeModal={onClose} title="Task Response" scroll>
        {response ? (
          <>
            <p className="mt-2 text-sm text-gray-500">
              Here's your response to this task.
            </p>
            <p className="mt-4">
              <span className="font-medium text-gray-900">Submitted on: </span>
              {dayjs(response.created_at).format("MMMM D, YYYY h:mm A")}
            </p>

            <div className="mt-4">
              <pre>{JSON.stringify(response.body, null, 2)}</pre>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-gray-500">
              Please respond to the task below.
            </p>
            <form className="mt-4" onSubmit={handleRespond}>
              <div className="mb-2">
                {body.map((item, i) => (
                  <div className="mb-4" key={i}>
                    <label className="block text-gray-700 text-sm font-bold mb-1">
                      {item.title}
                    </label>
                    {item.type === "string" ? (
                      <input
                        required
                        type="text"
                        value={item.response as string}
                        onChange={(e) =>
                          setBody(
                            body.map((b, j) =>
                              j === i ? { ...b, response: e.target.value } : b
                            )
                          )
                        }
                        placeholder="Enter your response"
                        className="relative w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline placeholder:text-gray-400 bg-white pl-3 pr-10 text-left focus-visible:border-indigo-500 focus-visible:ring-0 sm:text-sm"
                      />
                    ) : (
                      <input
                        required
                        type="checkbox"
                        checked={item.response as boolean}
                        onChange={(e) =>
                          setBody(
                            body.map((b, j) =>
                              j === i ? { ...b, response: e.target.checked } : b
                            )
                          )
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
              <Button type="submit" loading={loading}>
                Create
              </Button>
            </form>
          </>
        )}
      </Modal>
    </>
  );
};

export default UserTaskRow;
