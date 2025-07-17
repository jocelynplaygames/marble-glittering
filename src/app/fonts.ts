// app/fonts.ts (创建一个独立字体模块)
import { Press_Start_2P } from "next/font/google";

export const pressStart2P = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-pixel",
});