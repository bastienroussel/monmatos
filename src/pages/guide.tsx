import ComingSoon from "@/components/ui/ComingSoon"
import PublicLayout from "@/components/ui/layouts/PublicLayout"
import { ReactElement } from "react"
import { NextPageWithLayout } from "./_app"

const GuidePage: NextPageWithLayout = () => {
  return <ComingSoon name="Guide" />
}

GuidePage.getLayout = (page: ReactElement) => (
  <PublicLayout>{page}</PublicLayout>
)

export default GuidePage
