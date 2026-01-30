import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Activity, FolderKanban, CheckCircle2, FileText, Clock } from "lucide-react";
import { DashboardCharts } from "./charts";

interface ProjectsByStatus {
  status: string;
  count: number;
}

interface ProjectsByMonth {
  month: string;
  count: number;
}

interface TagFrequency {
  tag: string;
  count: number;
}

interface DashboardData {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  draftProjects: number;
  lastUpdated: Date | null;
  projectsByStatus: ProjectsByStatus[];
  projectsByMonth: ProjectsByMonth[];
  topTechTags: TagFrequency[];
  topSkillTags: TagFrequency[];
  recentProjects: {
    id: string;
    title: string;
    status: string;
    updatedAt: Date;
  }[];
}

async function getDashboardData(): Promise<DashboardData> {
  try {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        techTags: true,
        skillTags: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'Published').length;
    const completedProjects = projects.filter(p => p.status === 'Archived').length;
    const draftProjects = projects.filter(p => p.status === 'Draft').length;
    const lastUpdated = projects.length > 0 ? projects[0].updatedAt : null;

    const statusCounts = projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const projectsByStatus: ProjectsByStatus[] = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count: count as number,
    }));

    const monthCounts = projects.reduce((acc, project) => {
      const month = format(new Date(project.createdAt), 'MMM yyyy');
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const projectsByMonth: ProjectsByMonth[] = Object.entries(monthCounts)
      .map(([month, count]) => ({ month, count: count as number }))
      .slice(0, 12)
      .reverse();

    const techTagCounts: Record<string, number> = {};
    const skillTagCounts: Record<string, number> = {};

    projects.forEach(project => {
      if (project.techTags) {
        try {
          const tags = JSON.parse(project.techTags);
          if (Array.isArray(tags)) {
            tags.forEach(tag => {
              if (typeof tag === 'string') {
                techTagCounts[tag] = (techTagCounts[tag] || 0) + 1;
              }
            });
          }
        } catch (e) {
          console.error('Error parsing techTags:', e);
        }
      }

      if (project.skillTags) {
        try {
          const tags = JSON.parse(project.skillTags);
          if (Array.isArray(tags)) {
            tags.forEach(tag => {
              if (typeof tag === 'string') {
                skillTagCounts[tag] = (skillTagCounts[tag] || 0) + 1;
              }
            });
          }
        } catch (e) {
          console.error('Error parsing skillTags:', e);
        }
      }
    });

    const topTechTags = Object.entries(techTagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topSkillTags = Object.entries(skillTagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const recentProjects = projects.slice(0, 5).map(p => ({
      id: p.id,
      title: p.title,
      status: p.status,
      updatedAt: p.updatedAt,
    }));

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      draftProjects,
      lastUpdated,
      projectsByStatus,
      projectsByMonth,
      topTechTags,
      topSkillTags,
      recentProjects,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      totalProjects: 0,
      activeProjects: 0,
      completedProjects: 0,
      draftProjects: 0,
      lastUpdated: null,
      projectsByStatus: [],
      projectsByMonth: [],
      topTechTags: [],
      topSkillTags: [],
      recentProjects: [],
    };
  }
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    Published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your portfolio projects and analytics
          </p>
        </div>
        {data.lastUpdated && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Last updated: {format(new Date(data.lastUpdated), 'PPp')}
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              All projects in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              Currently published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.completedProjects}</div>
            <p className="text-xs text-muted-foreground">
              Archived projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.draftProjects}</div>
            <p className="text-xs text-muted-foreground">
              Work in progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <DashboardCharts
        projectsByStatus={data.projectsByStatus}
        projectsByMonth={data.projectsByMonth}
        topTechTags={data.topTechTags}
        topSkillTags={data.topSkillTags}
      />

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentProjects.length > 0 ? (
            <div className="space-y-4">
              {data.recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium leading-none">{project.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Updated {format(new Date(project.updatedAt), 'PPp')}
                    </p>
                  </div>
                  <StatusBadge status={project.status} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
              No recent projects
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
