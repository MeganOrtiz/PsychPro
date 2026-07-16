import { Toaster as Sonner } from "sonner"
import { PP, alpha } from "@/lib/palette"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      className="toaster group"
      style={{
        "--pp-toast-desc": alpha(PP.text, 0.75),
        "--pp-toast-error-bg": PP.redToast,
        "--pp-toast-error-border": alpha(PP.red400, 0.4),
      } as React.CSSProperties}
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            "group toast !rounded-2xl !border !text-[var(--pp-text)] " +
            "!bg-[var(--pp-surface)] !border-[var(--pp-navy-bright)] !shadow-none",
          title: "!text-[var(--pp-text)] !font-medium",
          description: "!text-[var(--pp-toast-desc)]",
          success: "!bg-[var(--pp-surface)] !border-[var(--pp-navy-bright)] !shadow-none",
          error:
            "!bg-[var(--pp-toast-error-bg)] !border-[var(--pp-toast-error-border)] !shadow-none",
          actionButton:
            "group-[.toast]:!bg-[var(--pp-tile)] group-[.toast]:!text-[var(--pp-text)]",
          cancelButton:
            "group-[.toast]:!bg-[var(--pp-tile)] group-[.toast]:!text-[var(--pp-toast-desc)]",
          icon: "!text-[var(--pp-text-dim)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
