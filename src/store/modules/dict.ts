import { defineStore } from "pinia"
import { ref } from "vue"

export const dictStore = defineStore("dict", () => {
  const gameType = ref([
    {
      label: "生成单位",
      key: "GeneraUnits",
      value: 0
    },
    {
      label: "超级武器",
      key: "SuperWeapons",
      value: 1
    },
    {
      label: "单位升级",
      key: "UnitUpgrade",
      value: 2
    },
    {
      label: "出售建筑",
      key: "SellBuild",
      value: 3
    },
    {
      label: "电脑攻击",
      key: "AiAttack",
      value: 4
    },
    {
      label: "系统消息",
      key: "Message",
      value: 5
    }
  ])

  const unitType = ref([
    {
      label: "飞行器",
      key: "Aircraft",
      value: 1
    },
    {
      label: "建筑物",
      key: "Building",
      value: 2
    },
    {
      label: "步兵",
      key: "Infantry",
      value: 3
    },
    {
      label: "车辆",
      key: "Vehicle",
      value: 7
    }
  ])

  const superWeaponType = ref([
    {
      label: "原子弹",
      key: "MultiMissile",
      value: 0
    },
    {
      label: "闪电风暴",
      key: "LightningStorm",
      value: 2
    }
  ])

  const playerType = ref([
    {
      label: "玩家",
      key: "Player",
      value: 0
    },
    {
      label: "电脑",
      key: "Ai",
      value: 1
    }
  ])

  const sellBuildType = ref([
    {
      label: "全部出售",
      key: "All",
      value: 0
    },
    {
      label: "随机出售",
      key: "Random",
      value: 1
    }
  ])

  const unitLevelType = ref([
    {
      label: "1星",
      key: "None",
      value: 0
    },
    {
      label: "2星",
      key: "Veteran",
      value: 1
    },
    {
      label: "3星",
      key: "Elite",
      value: 2
    }
  ])

  return { gameType, unitType, superWeaponType, playerType, sellBuildType, unitLevelType }
})
