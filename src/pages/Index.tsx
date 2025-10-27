import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import Icon from '@/components/ui/icon'
import { Progress } from '@/components/ui/progress'
import YeastDetailModal from '@/components/YeastDetailModal'
import ComparisonPanel from '@/components/ComparisonPanel'

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

const yeastProfiles: YeastProfile[] = [
  {
    id: 1,
    name: 'Сахаромицес',
    type: 'Saccharomyces cerevisiae',
    ph: 4.5,
    temperature: 25,
    emoji: '🍺',
    fermentationType: 'Спиртовое',
    characteristics: ['Активная', 'Термостойкая', 'pH-адаптивная']
  },
  {
    id: 2,
    name: 'Кандида',
    type: 'Candida utilis',
    ph: 5.0,
    temperature: 30,
    emoji: '🧪',
    fermentationType: 'Аэробное',
    characteristics: ['Быстрорастущая', 'Универсальная', 'Стрессоустойчивая']
  },
  {
    id: 3,
    name: 'Лактобациллус',
    type: 'Lactobacillus brevis',
    ph: 4.0,
    temperature: 28,
    emoji: '🥛',
    fermentationType: 'Молочнокислое',
    characteristics: ['Пробиотическая', 'Кислотоустойчивая', 'Медленная']
  },
  {
    id: 4,
    name: 'Торулопсис',
    type: 'Torulopsis glabrata',
    ph: 5.5,
    temperature: 32,
    emoji: '🌡️',
    fermentationType: 'Смешанное',
    characteristics: ['Термофильная', 'Адаптивная', 'Энергичная']
  },
  {
    id: 5,
    name: 'Бреттаномицес',
    type: 'Brettanomyces bruxellensis',
    ph: 3.8,
    temperature: 22,
    emoji: '🍷',
    fermentationType: 'Спонтанное',
    characteristics: ['Дикая', 'Ароматная', 'Медленная']
  },
  {
    id: 6,
    name: 'Пихия',
    type: 'Pichia pastoris',
    ph: 6.0,
    temperature: 30,
    emoji: '⚗️',
    fermentationType: 'Аэробное',
    characteristics: ['Промышленная', 'Продуктивная', 'Стабильная']
  }
]

const communities = [
  { name: 'Клуб спиртового брожения', members: 1248, emoji: '🍺', color: 'bg-orange-500' },
  { name: 'Молочнокислые культуры', members: 892, emoji: '🥛', color: 'bg-blue-500' },
  { name: 'Аэробные энтузиасты', members: 634, emoji: '💨', color: 'bg-purple-500' },
  { name: 'Дикие культуры', members: 451, emoji: '🌿', color: 'bg-green-500' }
]

const events = [
  { title: 'Дегустация новых штаммов', date: '15 ноября', location: 'Лаборатория №3', attendees: 42 },
  { title: 'Конференция по pH-оптимизации', date: '22 ноября', location: 'Онлайн', attendees: 156 },
  { title: 'Мастер-класс по совместимости', date: '28 ноября', location: 'Биоцентр', attendees: 67 }
]

function Index() {
  const [userPh, setUserPh] = useState([4.5])
  const [userTemp, setUserTemp] = useState([25])
  const [selectedYeast, setSelectedYeast] = useState<YeastProfile | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [comparisonYeasts, setComparisonYeasts] = useState<YeastProfile[]>([])
  const [showComparison, setShowComparison] = useState(false)

  const calculateCompatibility = (yeast: YeastProfile): number => {
    const phDiff = Math.abs(yeast.ph - userPh[0])
    const tempDiff = Math.abs(yeast.temperature - userTemp[0])
    const phScore = Math.max(0, 100 - phDiff * 20)
    const tempScore = Math.max(0, 100 - tempDiff * 5)
    return Math.round((phScore + tempScore) / 2)
  }

  const handleYeastClick = (yeast: YeastProfile) => {
    setSelectedYeast(yeast)
    setIsModalOpen(true)
  }

  const toggleComparison = (yeast: YeastProfile) => {
    if (comparisonYeasts.find(y => y.id === yeast.id)) {
      setComparisonYeasts(comparisonYeasts.filter(y => y.id !== yeast.id))
    } else {
      if (comparisonYeasts.length < 6) {
        setComparisonYeasts([...comparisonYeasts, yeast])
      }
    }
  }

  const removeFromComparison = (id: number) => {
    setComparisonYeasts(comparisonYeasts.filter(y => y.id !== id))
  }

  const clearComparison = () => {
    setComparisonYeasts([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-6xl">🧬</span>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              YeastMatch
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Платформа знакомств для дрожжевых культур. Найди идеальную пару по pH и температурным режимам!
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button
              size="lg"
              variant={showComparison ? 'default' : 'outline'}
              onClick={() => setShowComparison(!showComparison)}
              className={showComparison ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              <Icon name="GitCompare" size={20} className="mr-2" />
              {showComparison ? 'Скрыть сравнение' : 'Режим сравнения'}
              {comparisonYeasts.length > 0 && (
                <Badge className="ml-2 bg-orange-500">{comparisonYeasts.length}</Badge>
              )}
            </Button>
          </div>
        </header>

        {showComparison && (
          <section className="mb-20 animate-fade-in">
            <ComparisonPanel
              yeasts={comparisonYeasts}
              onRemove={removeFromComparison}
              onClear={clearComparison}
            />
          </section>
        )}

        <section className="mb-20 animate-fade-in">
          <Card className="border-2 border-purple-200 shadow-xl bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Icon name="Calculator" className="text-purple-600" size={32} />
                Калькулятор совместимости
              </CardTitle>
              <CardDescription className="text-lg">
                Настрой свои параметры и найди идеальное совпадение
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <label className="flex items-center gap-2 text-lg font-medium mb-4">
                  <Icon name="Droplet" className="text-blue-500" size={24} />
                  Уровень pH: {userPh[0].toFixed(1)}
                </label>
                <Slider
                  value={userPh}
                  onValueChange={setUserPh}
                  min={3}
                  max={7}
                  step={0.1}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>3.0 (кислая)</span>
                  <span>7.0 (нейтральная)</span>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-lg font-medium mb-4">
                  <Icon name="Thermometer" className="text-orange-500" size={24} />
                  Температура: {userTemp[0]}°C
                </label>
                <Slider
                  value={userTemp}
                  onValueChange={setUserTemp}
                  min={15}
                  max={40}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>15°C</span>
                  <span>40°C</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Профили дрожжей
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yeastProfiles.map((yeast, index) => {
              const compatibility = calculateCompatibility(yeast)
              return (
                <Card
                  key={yeast.id}
                  className="hover-scale border-2 hover:border-purple-400 transition-all duration-300 bg-white/90 backdrop-blur"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-5xl">{yeast.emoji}</span>
                        <div>
                          <CardTitle className="text-2xl">{yeast.name}</CardTitle>
                          <CardDescription className="text-sm italic">
                            {yeast.type}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        className={`${
                          compatibility >= 80
                            ? 'bg-green-500'
                            : compatibility >= 60
                            ? 'bg-yellow-500'
                            : 'bg-gray-400'
                        } text-white text-lg px-3 py-1`}
                      >
                        {compatibility}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Совместимость</span>
                        <span className="font-semibold">{compatibility}%</span>
                      </div>
                      <Progress value={compatibility} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Icon name="Droplet" className="text-blue-500" size={16} />
                        <span className="text-gray-600">pH: {yeast.ph}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Thermometer" className="text-orange-500" size={16} />
                        <span className="text-gray-600">{yeast.temperature}°C</span>
                      </div>
                    </div>

                    <div>
                      <Badge variant="outline" className="mb-2">
                        {yeast.fermentationType}
                      </Badge>
                      <div className="flex flex-wrap gap-2">
                        {yeast.characteristics.map((char, i) => (
                          <span key={i} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                            {char}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleYeastClick(yeast)
                        }}
                      >
                        <Icon name="Info" size={18} className="mr-2" />
                        Подробнее
                      </Button>
                      <Button
                        variant={comparisonYeasts.find(y => y.id === yeast.id) ? 'default' : 'outline'}
                        className={comparisonYeasts.find(y => y.id === yeast.id) ? 'bg-orange-500 hover:bg-orange-600' : ''}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleComparison(yeast)
                        }}
                      >
                        <Icon name={comparisonYeasts.find(y => y.id === yeast.id) ? 'Check' : 'Plus'} size={18} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
              Сообщества по типам брожения
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {communities.map((community, index) => (
              <Card
                key={index}
                className="hover-scale text-center border-2 hover:border-orange-400 transition-all bg-white/90 backdrop-blur"
              >
                <CardContent className="pt-6">
                  <div className={`${community.color} w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4`}>
                    {community.emoji}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{community.name}</h3>
                  <p className="text-gray-600 flex items-center justify-center gap-2">
                    <Icon name="Users" size={16} />
                    {community.members} участников
                  </p>
                  <Button variant="outline" className="mt-4 w-full">
                    Вступить
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-4xl font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              События и дегустации
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <Card key={index} className="hover-scale border-2 hover:border-blue-400 transition-all bg-white/90 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Icon name="Calendar" size={16} />
                    {event.date}
                  </div>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Icon name="MapPin" size={16} />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Icon name="Users" size={16} />
                      {event.attendees} участников
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Зарегистрироваться
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="text-center py-12 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-3xl text-white">
          <h2 className="text-4xl font-bold mb-4">Готов найти идеальную пару?</h2>
          <p className="text-xl mb-8 opacity-90">Присоединяйся к сообществу биохимических совпадений</p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6">
            <Icon name="Sparkles" size={24} className="mr-2" />
            Начать поиск
          </Button>
        </section>
      </div>

      <YeastDetailModal
        yeast={selectedYeast}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        compatibility={selectedYeast ? calculateCompatibility(selectedYeast) : 0}
      />
    </div>
  )
}

export default Index