import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  ChevronRight
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  type: 'action' | 'info' | 'warning';
  action: () => void;
  actionLabel: string;
}

interface AITaskAgentProps {
  tasks: Task[];
}

const priorityConfig = {
  high: { label: 'Alta', className: 'bg-red-100 text-red-800 border-red-300' },
  medium: { label: 'Média', className: 'bg-orange-100 text-orange-800 border-orange-300' },
  low: { label: 'Baixa', className: 'bg-blue-100 text-blue-800 border-blue-300' }
};

const typeIcon = {
  action: AlertCircle,
  info: TrendingUp,
  warning: Clock
};

export function AITaskAgent({ tasks }: AITaskAgentProps) {
  return (
    <Card className="border-[#C2D6FF] bg-gradient-to-br from-[#C2D6FF]/30 to-white">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#465EFF' }}>
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              Assistente Inteligente
              <span className="text-xs text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: '#465EFF' }}>IA</span>
            </CardTitle>
            <CardDescription>
              Tarefas prioritárias identificadas para você hoje
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-sm text-gray-600">
              Ótimo trabalho! Todas as tarefas prioritárias foram concluídas.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const priority = priorityConfig[task.priority];
              const Icon = typeIcon[task.type];
              
              return (
                <div
                  key={task.id}
                  className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                      ${task.priority === 'high' ? 'bg-red-100' :
                        task.priority === 'medium' ? 'bg-orange-100' :
                        'bg-blue-100'}
                    `}>
                      <Icon className={`
                        w-5 h-5
                        ${task.priority === 'high' ? 'text-red-600' :
                          task.priority === 'medium' ? 'text-orange-600' :
                          'text-blue-600'}
                      `} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm">{task.title}</h4>
                        <Badge variant="outline" className={priority.className}>
                          {priority.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">
                        {task.description}
                      </p>
                      <Button
                        size="sm"
                        variant={task.priority === 'high' ? 'default' : 'outline'}
                        onClick={task.action}
                        className="w-full sm:w-auto bg-[rgb(70,94,255)]"
                      >
                        {task.actionLabel}
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
