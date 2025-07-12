"use client";
//表示这是个客户端组件，表示这个组件要在浏览器执行，不能在服务器端渲染（因为用到了 useEffect, useState 等 hook）。
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// useState	存储组件的状态（比如 isMounted）
// useEffect	页面加载/更新时做一些操作（比如初始化编辑器）
// useRef	引用 DOM 元素 或 第三方对象（比如富文本编辑器）
// useCallback	定义一个函数，不会在每次渲染时重新创建（用于性能优化）
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";//控制页面跳转
import type EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";//异步提交逻辑（比如发帖）
import axios from "axios";//发送 POST 请求
import { useForm } from "react-hook-form";//表单校验和收集
import TextareaAutosize from "react-textarea-autosize";
import { type z } from "zod";

import { toast } from "~/components/ui/use-toast";
import { editorTools } from "~/lib/editor-tools";
import { PostValidator, type PostCreationRequest } from "~/lib/validators/post";

type FormData = z.infer<typeof PostValidator>;

//✅这个组件需要两个外部传入的参数：marbleId：你要发帖的社区 ID；slug：社区别名（如 "javascript"）
interface PostFormProps {//PostFormProps 是用来告诉 TypeScript：PostForm 组件需要接收哪些参数、什么类型。
  marbleId: string;
  slug: string;
}

//✅初始化表单功能。 PostForm 是一个发帖表单: 让用户输入「帖子标题」+「正文内容」→ 点击“Post”按钮 → 把这些数据发送给服务器
export function PostForm({ marbleId, slug }: PostFormProps) {//定义一个React 组件，名字叫 PostForm; PostFormProps, props 传参模式
  
  console.log("[PostForm] marbleId:", marbleId);
  console.log("[PostForm] slug:", slug);

  const {
    register,//register() 是用来绑定 <input>、<textarea> 的
    handleSubmit,//handleSubmit() 会在点击 Post 按钮时执行
    formState: { errors },//如果验证失败，错误信息就会出现在 errors 里
  } = useForm<FormData>({// React Hook Form 的核心钩子，它返回一个对象，用来控制表单行为
    resolver: zodResolver(PostValidator),//PostValidator 是用 Zod 写的校验规则，确保用户内容不为空等
    defaultValues: {//设置表单的默认值（title 为空，内容为空，marbleId 已传入）
      content: null,
      marbleId,
      title: "",
    },
  });

  // ✅编辑器初始化: 创建一个 ref 引用保存 富文本编辑器 EditorJS 的实例对象,写完帖子内容会保存成 block 数据（结构化内容）。以后就可以用 ref.current.save() 来获取内容，或者 ref.current.destroy() 来销毁它
  //🔧 管理富文本编辑器、标题输入框、加载状态，和页面跳转逻辑
  const ref = useRef<EditorJS>();//实例对象ref
  const _titleRef = useRef<HTMLTextAreaElement>(null);//引用页面上的“标题输入框”<TextareaAutosize />，方便你用 JS 聚焦它
  const [isMounted, setIsMounted] = useState(false);//isMounted：标记页面是否加载完成（必须加载后才能用 EditorJS）

  //const pathname = usePathname();//Next.js 提供的 hook，用来：获取当前页面的路径。可以用它来：跳转前保存原路径、提交成功后跳转回去（或者跳去别的路径）
  const router = useRouter();// Next.js 的“路由控制器”


  //✅ 提交功能：发帖子到后端。把发帖的过程封装成了一个 函数叫 createPost()，你只要调用它，就会完成整套流程。
  //用的是 React Query 的 useMutation + axios.post，✅ 把用户写的帖子内容提交给后端，然后做错误提示或跳转页面
  const { mutate: createPost } = useMutation({// react-query 中的 useMutation，异步
    mutationFn: async ({//发请求的函数本体，它接受一个对象参数（就是帖子内容），然后做...
      content,
      marbleId,
      title,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = { content, marbleId, title };//把传入的参数重新组合成一个对象，叫 payload，这是你要提交的内容。data:是后端返回的响应（例如 “OK” 或 帖子 ID）
      //用 axios.post("/api/marble/post/create", payload) 调用后端接口发帖
      const { data } = await axios.post("/api/marble/post/create", payload);// 👈 发帖请求 把帖子内容（payload）发给 /api/marble/post/create/route.ts后端对应文件; 发出 POST 请求 到 /api/marble/post/create
      //📍这就会自动访问：http://localhost:3000/api/marble/post/create
      // Next.js 会根据你的文件夹结构：/app/api/marble/post/create/route.ts自动把这个 URL 路由到/app/api/marble/post/create/route.ts的POST代码

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return data;
    },

    onError: () => {
      return toast({
        title: "Something went wrong.",
        description: "Your post was not published. Please try again.",
        variant: "destructive",
      });
    },

    onSuccess: () => {
      // Convert pathname `/m/community/submit` into `/m/community`
      console.log("[PostForm] Mutation succeeded, now pushing to:", `/m/${slug}`);
      //const newPathname = pathname.split("/").slice(0, -1).join("/");
      router.push(`/m/${slug}`);//这个项目发帖成功后是跳回“社区首页”
      //router.push(newPathname);
      //router.push(`/r/${slug}/${data.postId}`); // 跳到新帖详情页
      router.refresh();

      return toast({// 弹出成功提示
        description: "Your post has been published.",
      });
    },
  });


  //✅ 富文本初始化：异步加载富文本组件 EditorJS，并挂载在页面中 <div id="editor"> 的位置。
  // 初始化配置（挂载到页面、加载工具、设置提示语）; 保存 editor 实例到 ref，供以后使用
  //用 useCallback()为了避免每次组件刷新都重新定义 initializeEditor 函数。
  const initializeEditor = useCallback(async () => {//创建了一个异步函数 initializeEditor,外面用 useCallback 包裹，表示这个函数只创建一次，不会每次渲染都重新定义（性能优化）
    const EditorJS = (await import("@editorjs/editorjs")).default;//异步动态导入 EditorJS 这个库（因为它只能在浏览器运行）;不能直接 import，要 await import(...)，等它加载完才能用

    if (!ref.current) {//检查一下编辑器是不是已经初始化过了（只创建一次）
      const editor = new EditorJS({//创建一个新的富文本编辑器实例（这是它的核心用法）
        holder: "editor",//指定把编辑器挂在哪个 DOM 元素上，找的是 id="editor" 的 div
        onReady() {//编辑器加载完成后执行的函数
          ref.current = editor;//保存 editor 实例到 ref，后续就能用 ref.current.save() 获取内容
        },
        data: { blocks: [] },//编辑器的初始内容，这里设为空（用户从零开始写）
        inlineToolbar: true,//启内联工具栏（如加粗、链接等）
        placeholder: "Start typing here to create your post...",//提示语
        tools: editorTools,//指定你支持哪些编辑器工具（比如 paragraph、header、code、image）;这些工具是在 editorTools.ts 文件中定义好的
      });
    }
  }, []);

//✅ 页面加载时初始化:第一个	确保只在浏览器端执行;第二个	初始化富文本编辑器、设置焦点;第三个	弹出校验错误 toast
//useEffect(() => { ... }, []) 的依赖数组。“这个副作用函数只在组件挂载（首次加载）时运行一次。”“只有当[]这些依赖项的值发生变化时，这个 useEffect {}才会重新执行。”
//第一段 useEffect：   → 判断是浏览器 ➜ 设置 isMounted = true
  useEffect(() => {
    if (typeof window !== "undefined") {//检查当前环境是不是浏览器（不是服务器）:是浏览器 → 设置状态变量 isMounted = true
      //因为：EditorJS 是浏览器专用组件，不能在服务器端初始化;React 运行时第一次可能在服务端执行，因此必须判断 window 存在
      setIsMounted(true);// ➡️ 页面加载完成后就把 isMounted 设为 true➡️ 只有 isMounted 为 true，你才去初始化富文本编辑器（否则会报错）
    }
  }, []);
  //第二段 useEffect（因为 isMounted=true）：   1→ 调用 initializeEditor() 创建富文本编辑器   2→ 设置焦点到标题框
  //初始化富文本 + 聚焦标题框
  useEffect(() => {
    const init = async () => {
      await initializeEditor();//异步初始化 EditorJS 编辑器

      // Set focus on title
      setTimeout(() => {//等一帧后自动聚焦到标题输入框:React 渲染后要等下一帧 DOM 才“真的在页面上”,所以必须延迟一点点，光标才能正确聚焦
        _titleRef.current?.focus();// 自动把光标放在标题框里
      }, 0);
    };

    if (isMounted) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      init();//执行你刚刚自己定义的函数 initializeEditor();页面加载完成后初始化编辑器，并聚焦到标题输入框。

      return () => {//页面卸载时销毁 editor，避免内存泄露
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);//每次只要 isMounted 或 initializeEditor 发生变化，就会执行 useEffect 里的代码
//用户提交表单：   → 如果表单不合法 ➜ 第三段 useEffect 弹出 toast 提示
  useEffect(() => {
    if (Object.keys(errors).length) {//当 errors（由 react-hook-form 提供）有内容时
      for (const value of Object.values(errors)) {//遍历所有错误，弹出 toast 提示
        toast({//如果有任何字段输入不合法，就用 toast 弹出错误提示。
          title: "Something went wrong.",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);


  //✅ ✅ 表单提交逻辑: 当你点击“Post”时
  // 获取富文本内容;构建 payload;发帖请求（createPost）;让 react-query 自动接管 成功/失败 的逻辑
  async function onSubmit(data: FormData) {//async 异步函数：先执行 await ref.current?.save()，然后组装成 payload，然后 createPost(payload) 被调用
    const blocks = await ref.current?.save();// ⏱ 等 EditorJS 把你在富文本里写的内容转成结构化的 blocks 数据

    const payload: PostCreationRequest = {//payload 是一个对象，代表一篇完整的帖子
      content: blocks,
      marbleId,
      title: data.title,
    };
    //📌 点击按钮 → 执行 表单的onSubmit →调用你定义的 onSubmit(data) 函数 → 在这个函数里执行 createPost(payload) 发帖 ；createPost 就是 useMutation() 中封装的 axios.post(...) 请求
    //createPost(payload) 就是你用 useMutation() 封装好的“发帖”函数，它此刻被执行了。
    createPost(payload);// ✅ 发帖：调用 createPost()，这会触发 useMutation 里的 axios.post(...)//你不等，让 React Query 自动处理成功/失败
  }//发帖请求 createPost() 是“触发后自动管理”，你自己不管是否成功或失败，交给 react-query


  if (!isMounted) {//如果编辑器还没初始化完成（页面没挂载完），就不渲染页面内容，避免报错;常用于 防止 SSR（服务端渲染）出错
    return null;
  }


  
  const { ref: titleRef, ...rest } = register("title");//使用 react-hook-form 里的 register("title")，它返回一个对象，里面包括：
  // titleRef	标题输入框的 DOM 引用（原本是 register 给的）；...rest	其余的绑定属性（事件监听器、校验等）
//✅ UI 渲染（返回 JSX）: 输入标题 + 富文本 + 自动提交逻辑
// [PostForm]
//  └── <form onSubmit={handleSubmit(onSubmit)}>
//        ├── <TextareaAutosize /> ← 标题
//        ├── <div id="editor" /> ← 富文本挂载
//        └── 快捷提示
  return (
    <div className="w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:bg-slate-800">
      <form
        id="marble-post-form"
        className="w-fit"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        // ✅ 提交按钮点了就会执行 onSubmit
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert">
          {/* ✅ 帖子标题输入框（自动调整高度的 textarea） */}
          <TextareaAutosize
            ref={(e) => {
            titleRef(e);                // 绑定到 react-hook-form，让它管理输入状态
            _titleRef.current = e;      // 自己手动保存引用，用于自动聚焦（focus）
          }}
          {...rest}                     // 其他事件绑定（onChange、onBlur、校验等）
          placeholder="Title"          // 提示语
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
          {/* ✅ 富文本编辑器挂载点，EditorJS 会渲染到这个 div 上 */}
          <div id="editor" className="min-h-[500px]" />
           {/* ✅ 用户使用提示，告诉用户可以按 Tab 打开编辑器菜单 */}
          <p className="text-sm text-gray-500">
            Use{" "}
            <kbd className="rounded-md border bg-muted px-1 text-xs uppercase dark:bg-slate-200">
              Tab
            </kbd>{" "}
            to open the command menu.
          </p>
        </div>
      </form>
    </div>
  );
}
