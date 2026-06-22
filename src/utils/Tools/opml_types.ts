export interface OpmlNode {
  text: string
  type?: string
  xmlUrl?: string
  htmlUrl?: string
  description?: string
  children: OpmlNode[]
  collapsed: boolean
}

export interface OpmlMeta {
  title?: string
  dateCreated?: string
  dateModified?: string
  ownerName?: string
  ownerEmail?: string
}
