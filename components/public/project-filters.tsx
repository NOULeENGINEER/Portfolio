"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter, LayoutGrid, Table } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProjectFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusChange: (value: string) => void
  yearFilter: string
  onYearChange: (value: string) => void
  sortBy: string
  onSortChange: (value: string) => void
  selectedTags: string[]
  onTagToggle: (tag: string) => void
  availableTags: string[]
  availableYears: number[]
  viewMode: "grid" | "table"
  onViewModeChange: (mode: "grid" | "table") => void
  totalResults: number
}

export function ProjectFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  yearFilter,
  onYearChange,
  sortBy,
  onSortChange,
  selectedTags,
  onTagToggle,
  availableTags,
  availableYears,
  viewMode,
  onViewModeChange,
  totalResults,
}: ProjectFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search projects by title, summary, or description..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Year Filter */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Year</Label>
          <Select value={yearFilter} onValueChange={onYearChange}>
            <SelectTrigger>
              <SelectValue placeholder="All years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {availableYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Sort By</Label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* View Toggle */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">View</Label>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className="flex-1"
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewModeChange("table")}
              className="flex-1"
            >
              <Table className="h-4 w-4 mr-2" />
              Table
            </Button>
          </div>
        </div>
      </div>

      {/* Tag Filters */}
      {availableTags.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter by Tags
          </Label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isSelected = selectedTags.includes(tag)
              return (
                <Badge
                  key={tag}
                  variant={isSelected ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/20 transition-colors"
                  onClick={() => onTagToggle(tag)}
                >
                  {tag}
                </Badge>
              )
            })}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {(selectedTags.length > 0 || statusFilter !== "all" || yearFilter !== "all" || searchQuery) && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {totalResults} {totalResults === 1 ? "project" : "projects"} found
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSearchChange("")
              onStatusChange("all")
              onYearChange("all")
              onSortChange("recent")
              selectedTags.forEach((tag) => onTagToggle(tag))
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  )
}
