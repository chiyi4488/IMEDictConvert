"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { PopoverProps } from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import { useMutationObserver } from "@/hooks/use-mutation-observer";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Mode, ModeType } from "../data/modes";

interface ModeSelectorProps extends PopoverProps {
  types: readonly ModeType[];
  modes: Mode[];
  selectedMode: Mode;
  setSelectedMode: React.Dispatch<React.SetStateAction<Mode>>;
}

export function ModeSelector({ modes, types, selectedMode, setSelectedMode, ...props }: ModeSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [peekedMode, setPeekedMode] = React.useState<Mode>(selectedMode);

  return (
    <div className="grid gap-2">
      <HoverCard openDelay={200}>
        <HoverCardTrigger asChild>
          <Label htmlFor="mode">輸入法版本</Label>
        </HoverCardTrigger>
        <HoverCardContent
          align="start"
          className="w-[260px] text-sm"
          side="left"
        >
          The mode which will generate the completion. Some modes are suitable
          for natural language tasks, others specialize in code. Learn more.
        </HoverCardContent>
      </HoverCard>
      <Popover open={open} onOpenChange={setOpen} {...props}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a mode"
            className="w-full justify-between"
          >
            {selectedMode ? selectedMode.name : "Select a mode..."}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-[250px] p-0">
          <HoverCard>
            <HoverCardContent
              side="left"
              align="start"
              forceMount
              className="hidden sm:block min-h-[280px]"
            >
              <div className="grid gap-2">
                <h4 className="font-medium leading-none">{peekedMode.name}</h4>
                <div className="text-sm text-muted-foreground">
                  {peekedMode.description}
                </div>
                {peekedMode.strengths ? (
                  <div className="mt-4 grid gap-2">
                    <h5 className="text-sm font-medium leading-none">
                      其他資訊
                    </h5>
                    <ul className="text-sm text-muted-foreground">
                      {peekedMode.strengths}
                    </ul>
                  </div>
                ) : null}
              </div>
            </HoverCardContent>
            <Command loop>
              <CommandList className="h-[var(--cmdk-list-height)] max-h-[400px]">
                <CommandInput placeholder="搜尋版本..." />
                <CommandEmpty>找不到版本名稱。</CommandEmpty>
                <HoverCardTrigger />
                {types.map((type) => (
                  <CommandGroup key={type} heading={type}>
                    {modes
                      .filter((mode) => mode.type === type)
                      .map((mode) => (
                        <ModeItem
                          key={mode.id}
                          mode={mode}
                          isSelected={selectedMode?.id === mode.id}
                          onPeek={(mode) => setPeekedMode(mode)}
                          onSelect={() => {
                            setSelectedMode(mode);
                            setOpen(false);
                          }}
                        />
                      ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </HoverCard>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface ModeItemProps {
  mode: Mode;
  isSelected: boolean;
  onSelect: () => void;
  onPeek: (mode: Mode) => void;
}

function ModeItem({ mode, isSelected, onSelect, onPeek }: ModeItemProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  useMutationObserver(ref, (mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes") {
        if (mutation.attributeName === "aria-selected") {
          onPeek(mode);
        }
      }
    }
  });

  return (
    <CommandItem
      key={mode.id}
      onSelect={onSelect}
      ref={ref}
      className="aria-selected:bg-primary aria-selected:text-primary-foreground"
    >
      {mode.name}
      <CheckIcon
        className={cn(
          "ml-auto h-4 w-4",
          isSelected ? "opacity-100" : "opacity-0",
        )}
      />
    </CommandItem>
  );
}
