import { UIProps } from "@/utils/typedProps"
import { FC } from "react"
import Icon, { IconName } from "./Icon"
import cn from "classnames"

const variants = {
  primary: "text-white bg-emerald-500 border-emerald-500",
  secondary: "text-white bg-black border-black",
  white: "text-black bg-white border-black",
  red: "text-white bg-red-500 border-red-500",
}
const buttonSizes = {
  sm: "px-5 py-2 text-base font-semibold",
  md: "px-7 py-2 text-lg font-semibold",
  lg: "px-10 py-2 text-xl font-semibold",
}

const iconMargins = {
  lg: {
    left: "-ml-4 mr-3 w-6",
    right: "ml-3 -mr-4 w-6",
  },
  md: {
    left: "-ml-2 mr-3 w-4",
    right: "ml-3 -mr-2 w-4",
  },
  sm: {
    left: "-ml-2 mr-2 w-4",
    right: "ml-2 -mr-2 w-4",
  },
}

const Button: FC<
  UIProps<
    {
      variant?: keyof typeof variants
      size?: "sm" | "md" | "lg"
      icon?: IconName
      iconPosition?: "left" | "right"
    },
    "button"
  >
> = ({
  children,
  variant = "primary",
  size = "md",
  iconPosition = "left",
  icon,
  className,
  ...otherProps
}) => {
  const iconMarginClassName = children ? iconMargins[size][iconPosition] : ""

  return (
    <button
      {...otherProps}
      className={cn(
        "flex items-center justify-center rounded-xl border shadow-lg transition hover:scale-[0.98] hover:shadow-sm disabled:opacity-80 disabled:hover:scale-100",
        variants[variant],
        buttonSizes[size],
        className,
      )}
    >
      {!icon ? null : iconPosition === "right" ? null : (
        <Icon name={icon} className={iconMarginClassName} />
      )}
      {children}
      {!icon ? null : iconPosition === "left" ? null : (
        <Icon name={icon} className={iconMarginClassName} />
      )}
    </button>
  )
}

export default Button
