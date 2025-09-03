"use client"

import
{
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { MdBrightness6, MdCheck, MdOutlineDarkMode, MdOutlineLightMode, MdOutlinePalette } from "react-icons/md";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "../ui/shadcn-io/dropzone";

export function ThemeControl()
{
    const [color, setColor] = useState("#000000");
    const [theme, setTheme] = useState("light");

    const [image, setImage] = useState<File[] | undefined>();

    const handleDrop = (files: File[]) =>
    {
        console.log(files);
        setImage(files);
    };
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="size-10 hover:bg-accent rounded-full p-2 flex items-center justify-center transition cursor-pointer">
                    <MdOutlinePalette size={28} />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 border" side="bottom" align="end" sideOffset={10}>
                <div className=" space-y-4">
                    <div className="space-y-2">
                        <h4 className="leading-none font-medium text-xl">
                            Theme Controls
                        </h4>
                        <p className="text-muted-foreground text-sm">
                            Control the appearance of the application.
                        </p>
                    </div>
                    <label htmlFor="hex-source-color" className="bg-accent rounded-2xl p-4 flex justify-between items-center text-lg">
                        <span>
                            Hex Source Color
                        </span>
                        <input type="color" id="hex-source-color" className="border-0 p-0 size-10 rounded-full" value={color} onChange={(e) => setColor(e.target.value)} />
                    </label>
                    <div className="bg-accent rounded-2xl p-4 flex flex-col justify-between  text-lg">
                        <span>
                            Color From Image
                        </span>

                        <Dropzone
                            accept={{ 'image/*': [] }}
                            maxFiles={1}
                            onDrop={handleDrop}
                            onError={console.error}
                            src={image}
                        >
                            <DropzoneEmptyState />
                            <DropzoneContent />
                        </Dropzone>
                    </div>

                    <div className="border rounded-full overflow-hidden grid grid-cols-3">
                        <button onClick={() => setTheme("dark")} className={cn("p-2 flex justify-center items-center cursor-pointer hover:bg-accent gap-1", { "bg-accent": theme === "dark" })}>
                            {
                                theme === "dark" && <MdCheck size={18} />
                            }
                            <MdOutlineDarkMode size={18} />
                        </button>
                        <button onClick={() => setTheme("system")} className={cn("p-2 flex justify-center items-center border-x cursor-pointer hover:bg-accent gap-1", { "bg-accent": theme === "system" })}>
                            {
                                theme === "system" && <MdCheck size={18} />
                            }
                            <MdBrightness6 size={18} />
                        </button>
                        <button onClick={() => setTheme("light")} className={cn("p-2 flex justify-center items-center cursor-pointer hover:bg-accent gap-1", { "bg-accent": theme === "light" })}>
                            {
                                theme === "light" && <MdCheck size={18} />
                            }
                            <MdOutlineLightMode size={18} />
                        </button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
