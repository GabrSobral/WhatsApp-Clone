import { format, eachDayOfInterval } from "date-fns";

export function formatLastSeen(date: Date){
  let formattedDate = ''
  const today = new Date()

  const intervalDays = eachDayOfInterval({
    start: date,
    end: today
  })

  intervalDays.length === 1 && 
    (formattedDate = format(date, "'last seen today at' H:mm"))

  intervalDays.length === 2 && 
    (formattedDate = format(date, "'last seen yesterday at' H:mm"))

  intervalDays.length > 2 && intervalDays.length <= 7 &&
    (formattedDate = format(date, "'last seen 'EEEE' at' H:mm"))

  intervalDays.length > 8 &&
    (formattedDate = format(date, "'last seen 'yyyy/LL/dd' at' H:mm"))

  return formattedDate
}