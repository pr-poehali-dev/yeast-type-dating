import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Icon from '@/components/ui/icon'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts'

interface YeastProfile {
  id: number
  name: string
  type: string
  ph: number
  temperature: number
  emoji: string
  fermentationType: string
  characteristics: string[]
}

interface YeastDetailModalProps {
  yeast: YeastProfile | null
  isOpen: boolean
  onClose: () => void
  compatibility: number
}

const generateGrowthData = (optimalTemp: number, optimalPh: number) => {
  const data = []
  for (let hour = 0; hour <= 72; hour += 4) {
    const growth = Math.min(100, (hour / 72) * 100 * (0.8 + Math.random() * 0.4))
    data.push({
      hour,
      growth: parseFloat(growth.toFixed(1)),
      optimal: Math.min(100, (hour / 60) * 100),
      suboptimal: Math.min(80, (hour / 80) * 100)
    })
  }
  return data
}

const generateTempData = (optimalTemp: number) => {
  const data = []
  for (let temp = 15; temp <= 40; temp += 2) {
    const diff = Math.abs(temp - optimalTemp)
    const activity = Math.max(0, 100 - diff * 8)
    data.push({
      temp,
      activity: parseFloat(activity.toFixed(1))
    })
  }
  return data
}

const generatePhData = (optimalPh: number) => {
  const data = []
  for (let ph = 3; ph <= 7; ph += 0.3) {
    const diff = Math.abs(ph - optimalPh)
    const activity = Math.max(0, 100 - diff * 25)
    data.push({
      ph: parseFloat(ph.toFixed(1)),
      activity: parseFloat(activity.toFixed(1))
    })
  }
  return data
}

const YeastDetailModal = ({ yeast, isOpen, onClose, compatibility }: YeastDetailModalProps) => {
  if (!yeast) return null

  const growthData = generateGrowthData(yeast.temperature, yeast.ph)
  const tempData = generateTempData(yeast.temperature)
  const phData = generatePhData(yeast.ph)

  const stats = [
    { label: 'Оптимальный pH', value: yeast.ph.toFixed(1), icon: 'Droplet', color: 'text-blue-500' },
    { label: 'Температура', value: `${yeast.temperature}°C`, icon: 'Thermometer', color: 'text-orange-500' },
    { label: 'Совместимость', value: `${compatibility}%`, icon: 'Heart', color: 'text-pink-500' },
    { label: 'Тип брожения', value: yeast.fermentationType, icon: 'Zap', color: 'text-purple-500' }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-3xl">
            <span className="text-5xl">{yeast.emoji}</span>
            <div>
              <div>{yeast.name}</div>
              <div className="text-sm font-normal text-gray-500 italic">{yeast.type}</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6 text-center">
                <Icon name={stat.icon as any} className={`${stat.color} mx-auto mb-2`} size={32} />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {yeast.characteristics.map((char, i) => (
            <Badge key={i} variant="secondary" className="text-sm px-3 py-1">
              {char}
            </Badge>
          ))}
        </div>

        <Tabs defaultValue="growth" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="growth">График роста</TabsTrigger>
            <TabsTrigger value="temperature">Температура</TabsTrigger>
            <TabsTrigger value="ph">Уровень pH</TabsTrigger>
          </TabsList>

          <TabsContent value="growth" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Icon name="TrendingUp" className="text-green-600" />
                  Динамика роста культуры
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="hour" 
                      label={{ value: 'Время (часы)', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      label={{ value: 'Плотность (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="optimal" 
                      stackId="1" 
                      stroke="#10b981" 
                      fill="#10b981" 
                      fillOpacity={0.3}
                      name="Оптимальные условия"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="growth" 
                      stackId="2" 
                      stroke="#8b5cf6" 
                      fill="#8b5cf6" 
                      fillOpacity={0.6}
                      name="Текущий рост"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="suboptimal" 
                      stackId="3" 
                      stroke="#f59e0b" 
                      fill="#f59e0b" 
                      fillOpacity={0.2}
                      name="Субоптимальные условия"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                  <Icon name="Info" size={16} className="inline mr-2 text-blue-600" />
                  <strong>Пик активности:</strong> достигается через 48-60 часов при оптимальных условиях (pH {yeast.ph}, {yeast.temperature}°C)
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="temperature" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Icon name="Thermometer" className="text-orange-600" />
                  Зависимость активности от температуры
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={tempData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="temp" 
                      label={{ value: 'Температура (°C)', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      label={{ value: 'Активность (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="activity" 
                      stroke="#f97316" 
                      strokeWidth={3}
                      dot={{ fill: '#f97316', r: 4 }}
                      name="Метаболическая активность"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-blue-50 p-3 rounded-lg text-sm">
                    <div className="font-semibold text-blue-900">Минимум</div>
                    <div className="text-blue-700">15-20°C: замедленный рост</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-sm">
                    <div className="font-semibold text-green-900">Оптимум</div>
                    <div className="text-green-700">{yeast.temperature}°C: максимальная активность</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg text-sm">
                    <div className="font-semibold text-red-900">Максимум</div>
                    <div className="text-red-700">35-40°C: риск гибели</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ph" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Icon name="Droplet" className="text-blue-600" />
                  Зависимость активности от pH среды
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={phData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="ph" 
                      label={{ value: 'Уровень pH', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      label={{ value: 'Активность (%)', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="activity" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 4 }}
                      name="Ферментативная активность"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-red-50 p-3 rounded-lg text-sm">
                    <div className="font-semibold text-red-900">Кислая среда</div>
                    <div className="text-red-700">pH 3.0-3.5: стресс</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-sm">
                    <div className="font-semibold text-green-900">Оптимум</div>
                    <div className="text-green-700">pH {yeast.ph}: идеальная среда</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg text-sm">
                    <div className="font-semibold text-yellow-900">Нейтральная</div>
                    <div className="text-yellow-700">pH 6.0-7.0: снижение роста</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Icon name="Sparkles" className="text-purple-600" />
              Рекомендации по культивированию
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Icon name="Check" className="text-green-600 mt-0.5" size={16} />
                <span>Поддерживайте pH на уровне {(yeast.ph - 0.2).toFixed(1)}-{(yeast.ph + 0.2).toFixed(1)} для стабильного роста</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" className="text-green-600 mt-0.5" size={16} />
                <span>Оптимальная температура инкубации: {yeast.temperature - 2}°C - {yeast.temperature + 2}°C</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" className="text-green-600 mt-0.5" size={16} />
                <span>Пересев культуры рекомендуется каждые 48-72 часа</span>
              </li>
              <li className="flex items-start gap-2">
                <Icon name="Check" className="text-green-600 mt-0.5" size={16} />
                <span>Совместима с {yeast.fermentationType.toLowerCase()} брожением</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}

export default YeastDetailModal
