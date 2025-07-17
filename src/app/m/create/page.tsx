"use client";//表明这个组件是 客户端组件，必须在浏览器端运行（因为使用了 useState、useMutation 等 Hook）

import { useState } from "react";//用于管理表单输入（社区名）
import { useRouter } from "next/navigation";//Next.js 提供的路由跳转
import { useMutation } from "@tanstack/react-query";//React Query 提供的函数，用于处理异步请求（如创建 Marble）
import axios, { AxiosError } from "axios";//用于发送 POST 请求到 API

//你自定义或封装过的 UI 组件和工具
// import { Button } from "~/components/ui/button";
import { Button } from "~/components/client-only";
import { Input } from "~/components/ui/input";
import { toast } from "~/components/ui/use-toast";
import { useCustomToasts } from "~/hooks/use-custom-toasts";
import { type CreateMarblePayload } from "~/lib/validators/marble";

export default function CreateMarble() {
  const [input, setInput] = useState("");//input 保存当前输入框的值（用户输入的社区名）
  const router = useRouter();//router 用于导航跳转
  const { loginToast } = useCustomToasts();//loginToast() 是你封装的弹出提示方法，用于提示用户登录

  //发起创建社区请求：mutationFn 是点击按钮后要执行的逻辑，它会将输入值打包成 payload（确保结构为 { name: string }），然后调用后端 API：POST /api/marble
  const { mutate: createCommunity, isLoading } = useMutation<string, Error>({
    mutationFn: async () => {
      const payload: CreateMarblePayload = {
        name: input,
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      console.log("🧪 creating marble with payload:", payload);
      const { data } = await axios.post("/api/marble", payload);
      return data as string;
    },

    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Marble already exists.",
            description: "Please choose a different name for your marble.",
            variant: "destructive",
          });
        } else if (err.response?.status === 422) {
          return toast({
            title: "Invalid marble name.",
            description: "Please choose a name between 3 and 21 letters.",
            variant: "destructive",
          });
        } else if (err.response?.status === 401) {
          return loginToast();
        }
      }

      toast({
        title: "Something went wrong.",
        description: "Could not create marble. Please try again.",
        variant: "destructive",
      });
    },

    onSuccess: (data) => {
      router.push(`/m/${data}`);//成功后，跳转到新社区页面 /m/你的社区名
    },
  });

  //页面渲染部分，主要就是一个输入框和两个按钮：Input 输入社区名，Cancel 返回上一步，Create Marble 发起创建请求，按钮的启用/禁用状态由 input.length 和 isLoading 控制。
  // </div> {/* 按钮区域结束 */}最后一层是按钮区域，两个按钮水平排列并靠右显示。
  // </div> {/* 白色卡片容器 */}第二层是卡片样式容器，控制圆角、背景、间距；
  // </div> {/* 页面主布局容器 */}最外层是页面的主容器，控制最大宽度与居中；
  return (
    <div className="container mx-auto flex h-full max-w-3xl items-center">
      {/*这是一个响应式容器，页面居中显示，内容垂直居中。container: 使用 Tailwind 的布局容器类；mx-auto: 水平居中；flex: 使用 Flexbox 布局；h-full: 高度撑满父级容器；max-w-3xl: 最大宽度设为 3xl（通常是 768px）；items-center: 垂直方向居中子元素。*/}
      <div className="relative h-fit w-full space-y-6 rounded-lg p-4">
        {/**/}{/*内容包裹在一个带圆角的卡片中，有足够的间距和美观布局。relative: 为子元素提供定位参考；h-fit: 高度根据内容自动撑开；w-full: 占满父容器宽度；space-y-6: 子元素之间垂直间距为 1.5rem；rounded-lg: 圆角卡片；p-4: 内边距 1rem；*/}
        <div className="flex items-center justify-between">
          {/*标题栏“Create a Community”,flex: 水平布局；items-center justify-between: 左右对齐；h1: 主标题；text-2xl font-semibold: 字体大小为 2xl、字重半粗体。*/}
          <h1 className="text-2xl font-semibold">Create a Community</h1>
        </div>

        {/*一个 1 像素高的水平分隔线，用于视觉上区分标题与内容区域。*/}
        <hr className="h-1" />

        <div>
          {/*输入部分说明文本*/}
          {/*第一句是小标题；*/}
          <p className="pb-2 text-xl font-medium">Name</p>
          {/*第二句是解释说明（社区名一旦创建不能更改）*/}
          <p className="pb-2 text-sm">
            Community names (including capitalization) cannot be changed.
          </p>

          {/*输入框区域（带前缀）*/}
          {/*relative：让 m/ 文字可以 absolute 定位；*/}
          <div className="relative">
            {/*p 标签渲染固定前缀 m/，用于模仿 Reddit 的 r/;absolute inset-y-0 left-0: 垂直撑满、靠左定位；grid place-items-center: 内容垂直水平居中；w-8: 固定宽度；tracking-wider: 字符间距拉宽；*/}
            <p className="absolute inset-y-0 left-0 grid w-8 place-items-center text-sm font-medium tracking-wider">
              m/
            </p>
            {/*Input 组件：是一个封装好的输入框；value={input}：双向绑定输入；onChange: 实时更新状态；pl-6: 左侧内边距，为了避免输入文字和 m/ 重叠。*/}
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-6"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          {/*Flex 布局，使子元素（两个按钮）排列在一行；justify-end：将内容向右对齐（即按钮靠页面右边）；gap-4：两个按钮之间设置 1rem 的间距。*/}
          {/*一个“取消”按钮*/}
          <Button
            disabled={isLoading}//如果正在加载中，按钮禁用，避免重复点击
            variant="outline"//自定义的按钮外观样式（带边框）
            onClick={() => router.back()}//点击后触发 router.back()，返回上一个页面
          >
            Cancel
          </Button>

          {/*一个“ Create Marble”按钮*/}
          <Button
            isLoading={isLoading}//请求中按钮进入加载状态；
            disabled={input.length === 0}//如果没有输入内容，禁用按钮（防止空创建）
            onClick={() => createCommunity()}//点击这个按钮时执行 createCommunity() 发起社区创建请求
          >
            Create Marble
          </Button>
        </div>
      </div>
    </div>
  );
}
