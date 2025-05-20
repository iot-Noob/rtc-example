 
import { rtcExample } from '../Pages/rtcExample'
import { chatApp } from '../Pages/chatApp'
import { videoChat } from '../Pages/videoChat'
import webcamTest from '../Pages/webcamTest'
const SiteRoute = [
  {
    path: 'rtc', 
    Element: rtcExample,
  },
    {
    path: 'chat', 
    Element: chatApp,
  },
   {
    path: 'video', 
    Element: videoChat,
  },
   {
    path: 'webcam', 
    Element: webcamTest,
  },
]

export default SiteRoute
