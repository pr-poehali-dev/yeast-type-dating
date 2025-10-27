import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Icon from '@/components/ui/icon'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

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

interface ComparisonPanelProps {
  yeasts: YeastProfile[]
  onRemove: (id: number) => void
  onClear: () => void
}

const COLORS = ['#8b5cf6', '#ec4899', '#f97316', '#10b981', '#3b82f6', '#f59e0b']

const generateComparisonData = (yeasts: YeastProfile[]) => {
  const data = []
  for (let hour = 0; hour <= 72; hour += 6) {
    const point: any = { hour }
    yeasts.forEach(yeast => {
      const growth = Math.min(100, (hour / (80 - yeast.temperature)) * 100 * (0.8 + Math.random() * 0.3))
      point[yeast.name] = parseFloat(growth.toFixed(1))
    })
    data.push(point)
  }
  return data
}

const generateRadarData = (yeasts: YeastProfile[]) => {
  return [
    {
      metric: 'Термостойкость',
      ...yeasts.reduce((acc, yeast, idx) => ({ ...acc, [yeast.name]: (yeast.temperature / 40) * 100 }), {})
    },
    {
      metric: 'pH адаптация',
      ...yeasts.reduce((acc, yeast, idx) => ({ ...acc, [yeast.name]: ((7 - Math.abs(yeast.ph - 5)) / 2) * 100 }), {})
    },
    {
      metric: 'Скорость роста',
      ...yeasts.reduce((acc, yeast, idx) => ({ ...acc, [yeast.name]: 60 + Math.random() * 40 }), {})
    },
    {
      metric: 'Продуктивность',
      ...yeasts.reduce((acc, yeast, idx) => ({ ...acc, [yeast.name]: 50 + Math.random() * 50 }), {})
    },
    {
      metric: 'Стрессоустойчивость',
      ...yeasts.reduce((acc, yeast, idx) => ({ ...acc, [yeast.name]: 55 + Math.random() * 45 }), {})
    }
  ]
}

const ComparisonPanel = ({ yeasts, onRemove, onClear }: ComparisonPanelProps) => {
  if (yeasts.length === 0) {
    return (
      <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
        <CardContent className="py-12 text-center">
          <Icon name="GitCompare" className="mx-auto mb-4 text-gray-400" size={64} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            Панель сравнения пуста
          </h3>
          <p className="text-gray-500">
            Выберите несколько дрожжевых культур для сравнения их характеристик
          </p>
        </CardContent>
      </Card>
    )
  }

  const growthData = generateComparisonData(yeasts)
  const radarData = generateRadarData(yeasts)

  return (
    <div className="space-y-6">
      <Card className="border-2 border-purple-200 bg-white/90 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Icon name="GitCompare" className="text-purple-600" size={28} />
              Сравнение культур ({yeasts.length})
            </CardTitle>
            <Button variant="outline" size="sm" onClick={onClear}>
              <Icon name="X" size={16} className="mr-2" />
              Очистить
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-6">
            {yeasts.map((yeast, idx) => (
              <Badge
                key={yeast.id}
                variant="secondary"
                className="text-base px-4 py-2 flex items-center gap-2"
                style={{ backgroundColor: COLORS[idx] + '20', color: COLORS[idx] }}
              >
                <span className="text-xl">{yeast.emoji}</span>
                <span>{yeast.name}</span>
                <button
                  onClick={() => onRemove(yeast.id)}
                  className="ml-2 hover:opacity-70"
                >
                  <Icon name="X" size={16} />
                </button>
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {yeasts.map((yeast, idx) => (
              <Card key={yeast.id} className="border-2" style={{ borderColor: COLORS[idx] }}>
                <CardContent className="pt-4">
                  <div className="text-center mb-3">
                    <span className="text-3xl">{yeast.emoji}</span>
                    <h4 className="font-bold text-lg mt-2">{yeast.name}</h4>
                    <p className="text-xs text-gray-500 italic">{yeast.type}</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">pH:</span>
                      <span className="font-semibold">{yeast.ph}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Температура:</span>
                      <span className="font-semibold">{yeast.temperature}°C</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Брожение:</span>
                      <span className="font-semibold text-xs">{yeast.fermentationType}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-blue-200 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Icon name="TrendingUp" className="text-blue-600" />
            Сравнительная динамика роста
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="hour" 
                label={{ value: 'Время (часы)', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                label={{ value: 'Плотность культуры (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip />
              <Legend />
              {yeasts.map((yeast, idx) => (
                <Line
                  key={yeast.id}
                  type="monotone"
                  dataKey={yeast.name}
                  stroke={COLORS[idx]}
                  strokeWidth={3}
                  dot={{ fill: COLORS[idx], r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
            <Icon name="Info" size={16} className="inline mr-2 text-blue-600" />
            <strong>Анализ:</strong> График показывает скорость роста каждой культуры в одинаковых условиях. 
            Более крутая кривая означает более быструю адаптацию и размножение.
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-green-200 bg-white/90 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Icon name="Radar" className="text-green-600" />
            Радарный анализ характеристик
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={450}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Tooltip />
              <Legend />
              {yeasts.map((yeast, idx) => (
                <Radar
                  key={yeast.id}
                  name={yeast.name}
                  dataKey={yeast.name}
                  stroke={COLORS[idx]}
                  fill={COLORS[idx]}
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <Icon name="Thermometer" className="mx-auto mb-1 text-purple-600" size={20} />
              <div className="text-xs font-semibold">Термостойкость</div>
              <div className="text-xs text-gray-600 mt-1">Работа при высоких T°</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <Icon name="Droplet" className="mx-auto mb-1 text-blue-600" size={20} />
              <div className="text-xs font-semibold">pH адаптация</div>
              <div className="text-xs text-gray-600 mt-1">Гибкость к кислотности</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <Icon name="Zap" className="mx-auto mb-1 text-green-600" size={20} />
              <div className="text-xs font-semibold">Скорость роста</div>
              <div className="text-xs text-gray-600 mt-1">Время удвоения</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <Icon name="Factory" className="mx-auto mb-1 text-orange-600" size={20} />
              <div className="text-xs font-semibold">Продуктивность</div>
              <div className="text-xs text-gray-600 mt-1">Выход продукта</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg text-center">
              <Icon name="Shield" className="mx-auto mb-1 text-red-600" size={20} />
              <div className="text-xs font-semibold">Стрессоустойчивость</div>
              <div className="text-xs text-gray-600 mt-1">Выживаемость</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Icon name="Lightbulb" className="text-yellow-600" />
            Рекомендации по совместимости
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {yeasts.length === 2 && (
              <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
                <Icon name="Users" className="text-green-600 mt-1" size={20} />
                <div className="flex-1">
                  <div className="font-semibold text-green-900">Совместное культивирование</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {Math.abs(yeasts[0].ph - yeasts[1].ph) < 0.5 && Math.abs(yeasts[0].temperature - yeasts[1].temperature) < 5
                      ? '✅ Отличная совместимость! Можно культивировать в одной среде.'
                      : '⚠️ Средняя совместимость. Рекомендуется раздельное культивирование или адаптация условий.'}
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <Icon name="Target" className="text-blue-600 mt-1" size={20} />
              <div className="flex-1">
                <div className="font-semibold text-blue-900">Оптимальные условия для группы</div>
                <div className="text-sm text-gray-600 mt-1">
                  Средний pH: {(yeasts.reduce((sum, y) => sum + y.ph, 0) / yeasts.length).toFixed(1)} | 
                  Средняя T°: {Math.round(yeasts.reduce((sum, y) => sum + y.temperature, 0) / yeasts.length)}°C
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg">
              <Icon name="Beaker" className="text-purple-600 mt-1" size={20} />
              <div className="flex-1">
                <div className="font-semibold text-purple-900">Применение</div>
                <div className="text-sm text-gray-600 mt-1">
                  {yeasts.some(y => y.fermentationType === 'Спиртовое') && 'Подходит для производства алкоголя. '}
                  {yeasts.some(y => y.fermentationType === 'Молочнокислое') && 'Подходит для ферментации молочных продуктов. '}
                  {yeasts.some(y => y.fermentationType === 'Аэробное') && 'Подходит для биосинтеза белка.'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ComparisonPanel
