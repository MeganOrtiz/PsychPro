import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      className="toaster group"
      toastOptions={{
        unstyled: false,
        classNames: {
          toast:
            "group toast !rounded-2xl !border !text-[#e5e5e5] " +
            "!bg-[#141414] !border-[#3f3f3f] !shadow-none",
          title: "!text-[#e5e5e5] !font-medium",
          description: "!text-[rgba(229,229,229,0.75)]",
          success: "!bg-[#141414] !border-[#525252] !shadow-none",
          error:
            "!bg-[#2a1216] !border-[rgba(248,113,113,0.4)] !shadow-none",
          actionButton:
            "group-[.toast]:!bg-[rgba(255,255,255,0.12)] group-[.toast]:!text-[#e5e5e5]",
          cancelButton:
            "group-[.toast]:!bg-white/5 group-[.toast]:!text-[rgba(229,229,229,0.75)]",
          icon: "!text-[#a3a3a3]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
