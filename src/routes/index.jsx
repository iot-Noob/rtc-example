 
import { rtcExample } from '../Pages/rtcExample'
import { chatApp } from '../Pages/chatApp'
import VideoChat from '../Pages/videoChat'
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
    Element: VideoChat,
  },
   {
    path: 'webcam', 
    Element: webcamTest,
  },
]

export default SiteRoute
