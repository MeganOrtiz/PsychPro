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
            "group toast !rounded-2xl !border !text-[#E4F4F6] " +
            "!bg-[linear-gradient(145deg,rgba(19, 108, 139, 0.82),rgba(12, 66, 84, 0.90))] " +
            "!border-[rgba(118,228,247,0.32)] " +
            "!shadow-[inset_0_1px_0_rgba(167,243,255,0.10),0_10px_30px_rgba(0,0,0,0.45),0_0_28px_rgba(118,228,247,0.22)] " +
            "backdrop-blur-xl backdrop-saturate-150",
          title: "!text-[#E4F4F6] !font-medium",
          description: "!text-[rgba(228,244,246,0.78)]",
          success:
            "!bg-[linear-gradient(145deg,rgba(19, 108, 139, 0.82),rgba(12, 66, 84, 0.90))] " +
            "!border-[rgba(118,228,247,0.45)] " +
            "!shadow-[inset_0_1px_0_rgba(167,243,255,0.14),0_10px_30px_rgba(0,0,0,0.45),0_0_32px_rgba(118,228,247,0.32)]",
          error:
            "!bg-[linear-gradient(145deg,rgba(61,18,28,0.82),rgba(44,10,18,0.90))] " +
            "!border-[rgba(248,153,170,0.40)] " +
            "!shadow-[inset_0_1px_0_rgba(255,200,210,0.12),0_10px_30px_rgba(0,0,0,0.45),0_0_28px_rgba(248,113,133,0.28)]",
          actionButton:
            "group-[.toast]:!bg-[rgba(118,228,247,0.18)] group-[.toast]:!text-[#E4F4F6]",
          cancelButton:
            "group-[.toast]:!bg-white/5 group-[.toast]:!text-[rgba(228,244,246,0.75)]",
          icon: "!text-[#76E4F7]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
