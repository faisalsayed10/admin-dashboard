import React, { useState } from "react";
import { Project, Task, TaskBody } from "../../../lib/types";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import Table from "../../ui/Table";
import TableEmpty from "../../ui/TableEmpty";
import TableLoading from "../../ui/TableLoading";
import TaskRow from "./TaskRow";
import SingleSelect from "../../ui/SingleSelect";
import { MinusCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

type Props = {
  tasks: Task[] | undefined;
  projects: Project[] | undefined;
  setTasks: React.Dispatch<React.SetStateAction<Task[] | undefined>>;
};

const TasksTable: React.FC<Props> = ({ tasks, projects, setTasks }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [body, setBody] = useState<TaskBody[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string>("");
  const supabase = useSupabaseClient();

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const handleCreate = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);

      const { data, error } = await supabase
        .from("tasks")
        .insert([{ name, description: desc, project_id: selected, body }])
        .select("id");

      if (error) throw error;

      setTasks((prev) => [
        ...(prev || []),
        {
          id: data?.[0].id,
          name,
          description: desc,
          project_id: Number(selected),
          body,
          created_at: new Date(),
        },
      ]);

      setLoading(false);
      closeModal();
      setName("");
      setDesc("");
      setBody([]);
      setSelected("");
      toast.success("Task created successfully.");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <>
      <Table
        button="Create task"
        cols={["Name", "Description", "Body", "Project", "Submissions"]}
        description="A list of all the tasks currently in the system."
        heading="Tasks"
        onBtnClick={openModal}
      >
        {tasks && tasks.length < 1 && (
          <TableEmpty colSpan={5} message="No tasks found. Create a task." />
        )}
        {tasks ? (
          tasks.map((task, i) => <TaskRow key={task.id} task={task} projects={projects} />)
        ) : (
          <TableLoading colSpan={5} />
        )}
      </Table>
      <Modal
        scroll
        open={open}
        closeModal={closeModal}
        title="Create a new task"
      >
        <p className="mt-2 text-sm text-gray-500">
          Please enter the details of the task that you want to create.
        </p>
        <form className="mt-4" onSubmit={handleCreate}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Task name"
              className="relative w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline placeholder:text-gray-400 bg-white pl-3 pr-10 text-left focus-visible:border-indigo-500 focus-visible:ring-0 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Task description..."
              className="relative w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline placeholder:text-gray-400 bg-white pl-3 pr-10 text-left focus-visible:border-indigo-500 focus-visible:ring-0 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Project
            </label>
            <SingleSelect
              selected={selected}
              setSelected={setSelected}
              items={(projects || []).map((item) => ({
                value: item.id,
                label: `${item.name} (${
                  item.assigned_group?.name ||
                  item.assigned_user?.email ||
                  "Unassigned"
                })`,
              }))}
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Body
            </label>
            {body.map((item, i) => (
              <div
                className="mb-2 flex items-center justify-center gap-2"
                key={i}
              >
                <SingleSelect
                  items={[{ value: "string" }, { value: "boolean" }]}
                  selected={item.type}
                  setSelected={(type) =>
                    setBody(
                      body.map((b, j) =>
                        j === i
                          ? { ...b, type: type as "string" | "boolean" }
                          : b
                      )
                    )
                  }
                />
                <input
                  required
                  type="text"
                  value={item.title}
                  onChange={(e) =>
                    setBody(
                      body.map((b, j) =>
                        j === i ? { ...b, title: e.target.value } : b
                      )
                    )
                  }
                  placeholder="Have you done this?"
                  className="relative w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline placeholder:text-gray-400 bg-white pl-3 pr-10 text-left focus-visible:border-indigo-500 focus-visible:ring-0 sm:text-sm"
                />
                <button
                  className="text-red-500 hover:text-red-700 hover:bg-gray-100 p-1 rounded-md"
                  onClick={(e) => {
                    e.preventDefault();
                    setBody(body.filter((_, j) => j !== i));
                  }}
                >
                  <MinusCircleIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
          <div className="mb-4">
            <Button
              variant="secondary"
              loading={false}
              onClick={(e) => {
                e.preventDefault();
                setBody([
                  ...body,
                  { type: "boolean", title: "" },
                ] as TaskBody[]);
              }}
            >
              Add body
            </Button>
          </div>
          <Button type="submit" loading={loading}>
            Create
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default TasksTable;
