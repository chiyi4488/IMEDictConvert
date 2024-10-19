'use client';
import { useState } from "react";
import { useToast } from "@/hooks/use-toast"
import { ClipboardCopyIcon, DownloadIcon } from "@radix-ui/react-icons";
import { saveAs } from 'file-saver';
import iconv from 'iconv-lite';
import { crlf, CRLF } from 'crlf-normalize';

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ModeSelector } from "./components/mode-selector";
import { MoreActions } from "./components/more-actions";

import { modes, types, Mode } from "./data/modes";
import Link from "next/link";

const consonants = ['ㄅ', 'ㄆ', 'ㄇ', 'ㄈ', 'ㄉ', 'ㄊ', 'ㄋ', 'ㄌ', 'ㄍ', 'ㄎ', 'ㄏ', 'ㄐ', 'ㄑ', 'ㄒ', 'ㄓ', 'ㄔ', 'ㄕ', 'ㄖ', 'ㄗ', 'ㄘ', 'ㄙ'];
const medial = ['ㄧ', 'ㄨ', 'ㄩ'];
const rhyme = ['ㄚ', 'ㄛ', 'ㄜ', 'ㄝ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ', 'ㄦ'];
const tones = ['ˊ', 'ˇ', 'ˋ', '˙'];

export default function Page() {
  const { toast } = useToast();
  const [selectedMode, setSelectedMode] = useState<Mode>(modes[0]);
  const [conversionType, setConversionType] = useState<string>('going2msime');

  const handleConvert = () => {
    const inputData = (document.getElementById("inputData") as HTMLTextAreaElement).value;
    let outputData = '';

    if (conversionType === 'going2msime') {
      let buffer: string[] = [];
      const lines = inputData.split('\n');
      for (const line of lines) {
        if (line.includes('<!--Going12ProfileBackUpCsv-Begin-->') || line.includes('<!--Going13ProfileBackUpCsv-Begin-->')) {
          continue;
        }
        for (const char of line) {
          if (consonants.includes(char) || medial.includes(char) || rhyme.includes(char) || tones.includes(char)) {
            buffer.push(char);
          } else {
            if (buffer.length > 0) {
              outputData += processBuffer(buffer);
              buffer = [];
            }
            if (char == '-') {
              if (buffer.some(c => tones.includes(c))) {
                outputData += ' ';
              }
            } else if (char == ',') {
              outputData += '  ';
            } else if (char == '\n') {
              outputData += ' \n';
            } else {
              outputData += char;
            }
          }
        }
        if (buffer.length > 0) {
          outputData += processBuffer(buffer);
          buffer = [];
        }
        outputData += '\n';
      }
    } else if (conversionType === 'msime2going') {
      if (selectedMode.id === 'Going12') {
        outputData += '<!--Going12ProfileBackUpCsv-Begin-->\n';
      } else {
        outputData += '<!--Going13ProfileBackUpCsv-Begin-->\n';
      }

      const lines = inputData.split('\n');
      for (const line of lines) {
        const [textPart, ...bopomofoParts] = line.split('  ');
        outputData += textPart.trim();
        if (bopomofoParts.length > 0) {
          outputData += ',';
        }
        for (let i = 0; i < bopomofoParts.length; i++) {
          const word = bopomofoParts[i].trim();
          if (word === '') {
            continue;
          }

          const buffer: string[] = [];
          for (const char of word) {
            if (consonants.includes(char) || medial.includes(char) || rhyme.includes(char) || tones.includes(char)) {
              if (char != 'ˉ') {
                buffer.push(char);
              }
            } else if (char == ' ') {
              buffer.push('-');
            }
          }
          if (buffer[buffer.length - 1] == '-') {
            buffer.pop();
          }
          if (buffer.length > 0) {
            outputData += buffer.join('') + '-';
          }
        }
        if (outputData.endsWith('-')) {
          outputData = outputData.slice(0, -1);
        }
        outputData += '\n';
      }
      outputData = outputData.replace(/\n$/, '');
    }

    (document.getElementById("outputData") as HTMLTextAreaElement).value = outputData.trim();
  };

  const handleSwap = () => {
    const inputDataElement = document.getElementById("inputData") as HTMLTextAreaElement;
    const outputDataElement = document.getElementById("outputData") as HTMLTextAreaElement;
    const temp = inputDataElement.value;
    inputDataElement.value = outputDataElement.value;
    outputDataElement.value = temp;
  };

  const handleDownload: () => void = () => {
    const outputData = (document.getElementById("outputData") as HTMLTextAreaElement).value;
    const CRLFData = crlf(outputData, CRLF);
    if (conversionType === 'going2msime') {
      const utf16leData = iconv.encode(CRLFData, 'utf-16le');
      const bom = new Uint8Array([0xFF, 0xFE]); // UTF-16 LE BOM
      const blob = new Blob([bom, utf16leData], { type: "text/plain;charset=utf-16le" });
      saveAs(blob, "converted_data.txt");
    } else if (conversionType === 'msime2going') {
      const utf8Data = new TextEncoder().encode(CRLFData);
      const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // UTF-8 BOM
      const blob = new Blob([bom, utf8Data], { type: "text/csv;charset=utf-8" });
      saveAs(blob, "converted_data.csv");
    }
  };

  function processBuffer(buffer: string[]) {
    let result = '';
    let consonant = '　';
    let medialChar = '　';
    let rhymeChar = '　';
    let toneChar = '';

    for (const char of buffer) {
      if (consonants.includes(char) && consonant === '　') {
        consonant = char;
      } else if (medial.includes(char) && medialChar === '　') {
        medialChar = char;
      } else if (rhyme.includes(char) && rhymeChar === '　') {
        rhymeChar = char;
      } else if (tones.includes(char)) {
        toneChar = char;
      }
    }

    if (toneChar === '') {
      toneChar = 'ˉ';
    }

    result = consonant + medialChar + rhymeChar + toneChar + ' ';
    return result;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
      <div className="h-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <div className="ml-auto flex w-full space-x-1 sm:justify-start">
            <h2 className="text-lg font-semibold w-full sm:w-auto">輸入法詞庫轉換工具</h2>
          </div>

          <div className="ml-auto flex w-full space-x-1 sm:justify-end">
            <Select defaultValue='going2msime' onValueChange={(value) => setConversionType(value)}>
              <SelectTrigger className="flex-1 justify-between md:max-w-[200px] lg:max-w-[300px]">
                <SelectValue placeholder="選取轉換模式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="going2msime">自然輸入法 ＞ 微軟新注音</SelectItem>
                <SelectItem value="msime2going">微軟新注音 ＞ 自然輸入法</SelectItem>
              </SelectContent>
            </Select>

            <div className="space-x-2 md:flex">
              <Button onClick={handleConvert} variant="secondary">轉換</Button>
            </div>
            <MoreActions />
          </div>
        </div>
        <Separator />
        <div className="flex-1">
          <div className="container h-full py-6">
            <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
              <div className="flex-col space-y-4 flex md:order-2">
                <ModeSelector
                  types={types}
                  modes={modes}
                  selectedMode={selectedMode}
                  setSelectedMode={setSelectedMode}
                />
                <Separator></Separator>
                <Button variant="outline" onClick={handleSwap}>交換結果</Button>
                <Separator></Separator>
                <Button onClick={handleDownload}><DownloadIcon className="mr-2 h-4 w-4" />下載結果</Button>
                <Button onClick={() => {
                  const outputData = (document.getElementById('outputData') as HTMLTextAreaElement).value;
                  navigator.clipboard.writeText(outputData);
                  toast({ description: '已成功複製至剪貼簿。' });
                }}><ClipboardCopyIcon className="mr-2 h-4 w-4" />複製結果</Button>
              </div>
              <div className="md:order-1">
                <div className="mt-0 border-0 p-0">
                  <div className="flex flex-col space-y-4">
                    <div className="grid h-full grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1">
                      <Textarea
                        id="inputData"
                        placeholder="請在此處輸入 [原始轉換資料]。"
                        className="h-full min-h-[300px] lg:min-h-[700px] xl:min-h-[700px]"
                      />
                      <Textarea
                        id="outputData"
                        disabled
                        className="rounded-md border bg-muted h-full min-h-[300px] lg:min-h-[700px] xl:min-h-[700px]"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Separator className="my-1" />
        <span className="text-sm text-muted-foreground my-5">GPL-3.0 2024 <Link href="https://yi-chi.cotpear.com">Yi Chi</Link>.</span>
      </div>
    </div>
  );
}
