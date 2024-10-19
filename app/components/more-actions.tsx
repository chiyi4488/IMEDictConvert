"use client";

import * as React from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from 'next/link'
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

export function MoreActions() {
  const [open, setIsOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <span className="sr-only">Actions</span>
            <DotsHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuItem onSelect={() => setIsOpen(true)}>
            下載
          </DropdownMenuItem> */}
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem
            onSelect={() => setIsOpen(true)}>
            關於
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>關於本專案</DialogTitle>
            <DialogDescription>
              <p className="my-1">本專案的創作目的是為了協助使用者，將詞庫從 Microsoft 注音輸入法轉移至自然輸入法（反之亦然），簡化轉移過程並提高效率。</p>
              <p>本專案採用 GPL-3.0 開放原始碼條款，敬請遵守。</p>

            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="https://yi-chi.cotpear.com/assets/favicon.png" />
              <AvatarFallback>YC</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">齊一 Yi Chi</p>
              <p className="text-sm text-muted-foreground"><Link href="https://yi-chi.cotpear.com">https://yi-chi.cotpear.com</Link></p>
            </div>
          </div>
          <Separator className="my-1" />
          <span className="text-sm text-muted-foreground">GPL-3.0 2024 <Link href="https://yi-chi.cotpear.com">Yi Chi</Link>.</span>
          <DialogFooter>

            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              關閉
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
