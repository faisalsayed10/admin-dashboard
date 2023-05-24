import React, { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { RotatingLines } from "react-loader-spinner";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading: boolean;
  variant?: "primary" | "secondary";
};

const Button: React.FC<PropsWithChildren<Props>> = ({
  loading,
  children,
  variant = "primary",
  ...props
}) => {
  return (
    <button
      {...props}
      disabled={loading}
      className={`inline-flex mt-2 justify-center w-full rounded-md px-4 py-2 text-base font-medium ${
        variant === "primary"
          ? "border border-transparent bg-indigo-600 text-white hover:bg-indigo-700"
          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
      } focus:outline-none sm:text-sm disabled:opacity-50 ${props.className}`}
    >
      {loading ? (
        <RotatingLines
          strokeColor="grey"
          strokeWidth="2"
          animationDuration="0.75"
          width="16"
          visible={true}
        />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
