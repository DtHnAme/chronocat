import * as ccApi from '@chronocat/engine-chronocat-api'
import * as ccEvent from '@chronocat/engine-chronocat-event'
import * as media from '@chronocat/engine-media'
import { chronocat } from '@chronocat/shell'

const octx = chronocat()

if (octx) {
  octx.load(ccApi)
  octx.load(ccEvent)
  octx.load(media)
}
