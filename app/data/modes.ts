export const types = ["Going"] as const

export type ModeType = (typeof types)[number]

export interface Mode<Type = string> {
  id: string
  name: string
  description: string
  strengths?: string
  type: Type
}

export const modes: Mode<ModeType>[] = [
  {
    id: "Going13",
    name: "自然輸入法 13",
    description:
      "使用此版本以匯入詞庫至自然輸入法 13。",
    type: "Going",
    strengths:
      "",
  },
  {
    id: "Going12",
    name: "自然輸入法 12",
    description: "使用此版本以匯入詞庫至自然輸入法 12。",
    type: "Going",
    strengths:
      "",
  },
]
