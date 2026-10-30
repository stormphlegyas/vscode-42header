
      /*#######.
     ########",#:
   #########',##".
  ##'##'## .##',##.
   ## ## ## # ##",#.
    ## ## ## ## ##'
     ## ## ## :##
      ## ## ##*/

import moment = require('moment')
import { languageDelimiters } from './delimiters'

export type HeaderInfo = {
  filename: string,
  author: string,
  createdBy: string,
  createdAt: moment.Moment,
  updatedBy: string,
  updatedAt: moment.Moment
}

/**
 * Template where each field name is prefixed by $ and is padded with _
 */
const genericTemplate = `
********************************************************************************
*                                                                              *
*                                                         :::      ::::::::    *
*    $FILENAME__________________________________        :+:      :+:    :+:    *
*                                                     +:+ +:+         +:+      *
*    By: $AUTHOR________________________________    +#+  +:+       +#+         *
*                                                 +#+#+#+#+#+   +#+            *
*    Created: $CREATEDAT_________ by $CREATEDBY_       #+#    #+#              *
*    Updated: $UPDATEDAT_________ by $UPDATEDBY_      ###   ########.fr        *
*                                                                              *
********************************************************************************

`.substring(1)

/**
 * Get specific header template for languageId
 */

const getTemplate = (languageId: string) => {

  const isAssembly = /(?:asm|assembly)/i.test(languageId) && supportsLanguage(languageId) == false;
  
  const [topLeft, topRight, left, right, bottomLeft, bottomRight] = isAssembly ? languageDelimiters["asm"] : languageDelimiters[languageId];

  return genericTemplate
    .split('\n')
    .map((line, index, array) => {
      if (index === 0) {
        return line.replace(new RegExp(`^(.{${topLeft.length}})(.*)(.{${topRight.length}})$`, 'g'), topLeft + '$2' + topRight);
      } else if (index === array.length - 3) {
        return line.replace(new RegExp(`^(.{${bottomLeft.length}})(.*)(.{${bottomRight.length}})$`, 'g'), bottomLeft + '$2' + bottomRight);
      } else {
        return line.replace(new RegExp(`^(.{${left.length}})(.*)(.{${right.length}})$`, 'g'), left + '$2' + right);
      }
    })
    .join('\n');
};

/**
 * Characters taking two columns in a monospace font (CJK, emoji)
 */
const wideChar = /[\u1100-\u115F\u2E80-\u303E\u3041-\u33FF\u3400-\u4DBF\u4E00-\u9FFF\uA000-\uA4CF\uAC00-\uD7A3\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFF60\uFFE0-\uFFE6\u{20000}-\u{3FFFD}]|\p{Emoji_Presentation}/u

/**
 * Number of columns taken by a character, combining marks take none
 */
const charWidth = (char: string) =>
  /[\p{M}\p{Cf}]/u.test(char) ? 0 : wideChar.test(char) ? 2 : 1

/**
 * Fit value to correct field width, truncated or padded with spaces
 */
const pad = (value: string, width: number) => {
  let result = ''
  let used = 0

  for (const char of value.normalize('NFC').replace(/\p{Cc}/gu, ' ')) {
    const charCols = charWidth(char)
    if (used + charCols > width) break
    result += char
    used += charCols
  }

  return result.concat(' '.repeat(width - used))
}

/**
 * Stringify Date to correct format for header
 */
const formatDate = (date: moment.Moment) =>
  date.format('YYYY/MM/DD HH:mm:ss')

/**
 * Get Date object from date string formatted for header
 */
const parseDate = (date: string) =>
  moment(date, 'YYYY/MM/DD HH:mm:ss')

/**
 * Check if language is supported
 */
export const supportsLanguage = (languageId: string) =>
  languageId in languageDelimiters

export const headerHeight = 11
const border = /\*{20,}/
const dateField = '(\\d{4}/\\d{2}/\\d{2} \\d{2}:\\d{2}:\\d{2})'
/**
 * Words separated by single spaces, the next field or the logo is further away
 */
const textField = '(\\S+(?: \\S+)*)'

const fieldRegexes = {
  filename: new RegExp(`^\\S*\\s+${textField}`),
  author: new RegExp(`By: ${textField}`),
  created: new RegExp(`Created: ${dateField} by ${textField}`),
  updated: new RegExp(`Updated: ${dateField} by ${textField}`)
}

/**
 * Returns current header text if present at top of document
 * Fields are found by label rather than by column, so headers deformed by
 * a previous version (values too wide) are still recognized and re-rendered
 */
export const extractHeader = (text: string): string | null => {
  const lines = text.split(/\r?\n/, headerHeight)

  return lines.length === headerHeight
    && border.test(lines[0])
    && border.test(lines[headerHeight - 1])
    && fieldRegexes.created.test(lines[7])
    && fieldRegexes.updated.test(lines[8])
    ? lines.join('\n')
    : null
}

/**
 * Regex to match field in template
 * Returns [ global match, offset, field ]
 */
const fieldRegex = (name: string) =>
  new RegExp(`^((?:.*\\\n)*.*)(\\\$${name}_*)`, '')

/**
 * Set field value in header string
 */
const setFieldValue = (header: string, name: string, value: string) => {
  const [_, offset, field] = genericTemplate.match(fieldRegex(name))

  return header.substr(0, offset.length)
    .concat(pad(value, field.length))
    .concat(header.substr(offset.length + field.length))
}

const matchField = (line: string, regex: RegExp) =>
  line.match(regex) || []

/**
 * Extract header info from header string
 */
export const getHeaderInfo = (header: string): HeaderInfo => {
  const lines = header.split('\n')
  const [, filename = ''] = matchField(lines[3], fieldRegexes.filename)
  const [, author = ''] = matchField(lines[5], fieldRegexes.author)
  const [, createdAt = '', createdBy = ''] = matchField(lines[7], fieldRegexes.created)
  const [, updatedAt = '', updatedBy = ''] = matchField(lines[8], fieldRegexes.updated)

  return {
    filename,
    author,
    createdBy,
    createdAt: parseDate(createdAt),
    updatedBy,
    updatedAt: parseDate(updatedAt)
  }
}

/**
 * Renders a language template with header info
 * Fields are set from the last one so a value whose length differs from its
 * width (wide characters) does not shift the offsets of the next ones
 */
export const renderHeader = (languageId: string, info: HeaderInfo) => [
  { name: 'FILENAME', value: info.filename },
  { name: 'AUTHOR', value: info.author },
  { name: 'CREATEDAT', value: formatDate(info.createdAt) },
  { name: 'CREATEDBY', value: info.createdBy },
  { name: 'UPDATEDAT', value: formatDate(info.updatedAt) },
  { name: 'UPDATEDBY', value: info.updatedBy }
].reduceRight((header, field) =>
  setFieldValue(header, field.name, field.value),
  getTemplate(languageId))
