"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

interface ChartsProps {
  projectsByStatus: ProjectsByStatus[];
  projectsByMonth: ProjectsByMonth[];
  topTechTags: TagFrequency[];
  topSkillTags: TagFrequency[];
}

export function DashboardCharts({
  projectsByStatus,
  projectsByMonth,
  topTechTags,
  topSkillTags,
}: ChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Projects by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Projects by Status</CardTitle>
        </CardHeader>
        <CardContent>
          {projectsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={projectsByStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Projects Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Projects Created Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {projectsByMonth.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projectsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Projects"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Tech Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Top Tech Tags</CardTitle>
        </CardHeader>
        <CardContent>
          {topTechTags.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topTechTags} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="tag" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Skill Tags */}
      <Card>
        <CardHeader>
          <CardTitle>Top Skill Tags</CardTitle>
        </CardHeader>
        <CardContent>
          {topSkillTags.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topSkillTags} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="tag" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
