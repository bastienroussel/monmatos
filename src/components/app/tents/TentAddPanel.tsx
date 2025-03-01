import { Modal } from "@/components/app/modal"
import { useGroup } from "@/components/hooks/useGroup"
import { useModalContext } from "@/components/hooks/useModalContext"
import Button from "@/components/ui/Button"
import Icon from "@/components/ui/Icon"
import Textarea from "@/components/ui/Textarea"
import { Tents } from "@/pages/tentes"
import { units } from "@/utils/records"
import { trpc } from "@/utils/trpc"
import { UIProps } from "@/utils/typedProps"
import { State, Unit } from "@prisma/client"
import classNames from "classnames"
import Head from "next/head"
import { FC, FormEvent, useState } from "react"
import { toast } from "react-hot-toast"
import TentInput from "./TentInput"
import { getTentsErrorMessage } from "./tentsErrorMessage"

const TentAddPanel: FC<UIProps<{ tents: Tents }>> = ({ tents }) => {
  const { movement } = useGroup()
  const { setModal } = useModalContext()
  const trpcCtx = trpc.useContext()
  const createMutation = trpc.tents.create.useMutation({
    onSuccess() {
      setModal({} as Modal)
    },
    onError() {
      setBlacklist((prev) => [...prev, identifyingNum as number])
    },
    onSettled() {
      trpcCtx.tents.getAll.invalidate()
    },
  })
  const [blacklist, setBlacklist] = useState(
    tents.map((tent) => tent.identifyingNum),
  )
  const [identifyingNum, setIdentifyingNum] = useState<number | null>(null)
  const [state, setState] = useState<State>("NEUF")
  const [unit, setUnit] = useState<Unit>("GROUPE")
  const [size, setSize] = useState(6)
  const [complete, setComplete] = useState(true)
  const [integrated, setIntegrated] = useState(false)
  const [type, setType] = useState("CANADIENNE")
  const [comments, setComments] = useState("")
  const closePanel = () => setModal({} as Modal)
  const handleAdd = (e: FormEvent) => {
    e.preventDefault()

    if (identifyingNum) {
      const createPromise = createMutation.mutateAsync({
        identifyingNum,
        state,
        size,
        unit,
        complete,
        integrated,
        type,
        comments,
      })
      toast.promise(createPromise, {
        success: "Tente ajoutée",
        error: getTentsErrorMessage,
        loading: "Ajout en cours ...",
      })
    }
  }

  return (
    <>
      <Head>
        <title>Ajouter une tente | MonMatos</title>
      </Head>
      <form
        className="mx-auto max-w-[450px] space-y-6 py-4"
        onSubmit={handleAdd}
      >
        <div
          className={classNames(
            "mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4",
            {
              "border-slate-800 text-slate-800": !identifyingNum,

              "border-emerald-500/90 text-emerald-500/90":
                identifyingNum && !blacklist.includes(identifyingNum),
              "border-red-500/90 text-red-500/90":
                identifyingNum && blacklist.includes(identifyingNum),
            },
          )}
        >
          <input
            type="text"
            autoFocus
            className="w-[90px] rounded-lg border-2 border-dashed bg-transparent p-1 px-2 text-center text-3xl font-bold outline-none"
            placeholder={"XX"}
            onChange={(e) => setIdentifyingNum(parseInt(e.target.value))}
            value={identifyingNum || ""}
          />
        </div>
        <div className="pt-4">
          <div
            className={classNames(
              "mx-auto flex w-fit items-center space-x-2 rounded-lg py-1 px-2 text-sm font-medium  sm:text-base",
              {
                "bg-amber-100 text-amber-800": !identifyingNum,
                "bg-green-100 text-green-800":
                  identifyingNum &&
                  !blacklist.includes(identifyingNum as number),
                "bg-red-100 text-red-800":
                  identifyingNum &&
                  blacklist.includes(identifyingNum as number),
              },
            )}
          >
            <Icon name="MdOutlineErrorOutline" className="text-xl" />
            <span>Choisissez un numéro de tente non attribué</span>
          </div>
        </div>
        <div>
          <p className="text-lg font-bold">Informations</p>
          <p>Cliquez sur les éléments afin de les modifier</p>
        </div>
        <div className="space-y-2">
          <TentInput
            label="Attribué aux"
            value={unit}
            setValue={(value) => setUnit(value as Unit)}
            options={Object.entries(units[movement]).map(([key, value]) => [
              key as Unit,
              value,
            ])}
          />
          <TentInput
            label="Taille"
            value={size.toString()}
            setValue={(value) => {
              const int = parseInt(value as string)
              setSize(int)
            }}
            options={[
              ["1", "1 place"],
              ["2", "2 places"],
              ["3", "3 places"],
              ["4", "4 places"],
              ["5", "5 places"],
              ["6", "6 places"],
              ["8", "8 places"],
              ["9", "9 places"],
              ["10", "10 places"],
            ]}
          />
          <TentInput
            label="ÉTAT"
            value={state}
            setValue={(value) => setState(value as State)}
            options={Object.entries(State).map(([key, value]) => [
              key as State,
              value,
            ])}
          />
          <TentInput
            label="Complète ?"
            value={complete ? "OUI" : "NON"}
            setValue={(value) => setComplete(value === "OUI" ? true : false)}
            options={[
              ["OUI", "OUI"],
              ["NON", "NON"],
            ]}
          />
          <TentInput
            label="TYPE"
            value={type.toUpperCase()}
            setValue={setType}
            options={[
              ["CANADIENNE", "CANADIENNE"],
              ["QUECHUA", "QUECHUA"],
              ["MARABOUT", "MARABOUT"],
            ]}
          />
          <TentInput
            label="Tapis de sol"
            value={integrated ? "INTÉGRÉ" : "NORMAL"}
            setValue={(value) =>
              setIntegrated(value === "INTÉGRÉ" ? true : false)
            }
            options={[
              ["INTÉGRÉ", "INTÉGRÉ"],
              ["NORMAL", "NORMAL"],
            ]}
          />
        </div>
        <Textarea
          label="Commentaires"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
        <div className="flex flex-wrap items-center justify-center gap-8">
          <Button
            type="button"
            onClick={closePanel}
            size="sm"
            icon="HiArrowLeft"
            variant="white"
            className="max-w-fit"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={
              !identifyingNum ||
              blacklist.includes(identifyingNum) ||
              createMutation.isLoading
            }
            size="sm"
            icon="RiSave2Fill"
            className="max-w-fit"
          >
            {createMutation.isLoading ? "Ajout ..." : "Ajouter"}
          </Button>
        </div>
      </form>
    </>
  )
}

export default TentAddPanel
