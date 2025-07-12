import * as React from "react";//用来创建组件
import { Slot } from "@radix-ui/react-slot";//来自 Radix UI，允许你把 Button 当作 wrapper 来渲染任意元素（比如 <a>、<Link> 等）。
import { cva, type VariantProps } from "class-variance-authority";//cva：来自 class-variance-authority，用于创建样式变体（variant）系统。

import { cn } from "~/lib/utils";//cn()：是你项目里封装的 class 合并工具（大概是 clsx），合并多个类名字符串。

const buttonVariants = cva(
  //一个样式字符串，用于定义按钮（Button）组件的基础样式
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
           "bg-primary text-primary-foreground hover:bg-primary/90",//背景：主题主色（bg-primary）；字体颜色：主色对应的前景色（text-primary-foreground）；悬停时：背景颜色稍微变淡（hover:bg-primary/90）
        destructive://红色警告风格（destructive）
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline://描边按钮（无背景色）；边框颜色是输入框颜色（border-input）；背景透明，悬停时加亮色（accent）
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary://👉 适合“取消”、“返回”这类次要操作：使用主题里的次级颜色；比 default 更轻柔一些的视觉效果
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: //默认透明，没有背景或边框;悬停时才显示强调色
          "hover:bg-accent hover:text-accent-foreground",
        link: //像超链接一样的按钮;有主色文字，悬停时显示下划线（偏 UX）
          "text-primary underline-offset-4 hover:underline",
      },
      size: {// 4 种尺寸样式：default: 默认大小按钮；sm: 小按钮；lg: 大按钮；icon: 仅图标按钮
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {//如果使用 <Button /> 没传入 variant 或 size，就默认使用：variant: "default" → 默认样式（蓝色按钮之类）；size: "default" → 正常大小按钮
      variant: "default",
      size: "default",
    },
  },
);


//🔶 ButtonProps 接口
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,//继承了所有原生 <button> 支持的属性，如 onClick, disabled, type, children 等
    VariantProps<typeof buttonVariants> {//来自 CVA，支持传入：variant: "default" | "outline" | "ghost" | ..;size: "default" | "sm" | "lg" | "icon"
  asChild?: boolean;//为了支持 "把按钮渲染成别的组件" —— 比如用在 <Link> 或 <a> 里
  //如果你传了 asChild，Button 会渲染你包在里面的那个标签（比如 <Link>）。否则默认就渲染成 <button>。
  isLoading?: boolean;//是否为加载中状态，设置后会自动禁用按钮。
}

//🔧 Button 组件的实现
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";//如果 asChild=true，就会使用 Slot 渲染（来自 Radix），否则就是普通 <button>。
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}//用 CVA 组合出对应样式类
        ref={ref}
        disabled={isLoading}//如果正在加载，自动禁用按钮（防止重复点击）
        {...props}//将其他传入的按钮属性（如 onClick, children）原样传给 <button> 元素。
      />
    );
  },
);
//🔚 最后导出
Button.displayName = "Button";//为了在 React DevTools 中显示组件名称Button,而不是你在 React 开发者工具里看到的可能是 "ForwardRef" 或匿名组件。
export { Button, buttonVariants };//导出 Button 和 buttonVariants，便于其他地方复用或自定义样式。比如
//import { Button } from "~/components/ui/button";
//const customClass = buttonVariants({ variant: "ghost", size: "lg" });是你用 class-variance-authority 定义的样式变体函数，也可以在其他组件复用
