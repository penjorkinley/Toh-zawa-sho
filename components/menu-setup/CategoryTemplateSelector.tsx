"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/shadcn-button";
import { type CategoryTemplate } from "@/lib/data/menu-templates";
import { ArrowRight, Check } from "lucide-react";
import * as React from "react";

interface CategoryTemplateSelectorProps {
  templates: CategoryTemplate[];
  onNext: (selectedTemplates: CategoryTemplate[]) => void;
}

export default function CategoryTemplateSelector({
  templates,
  onNext,
}: CategoryTemplateSelectorProps) {
  const [selectedTemplateIds, setSelectedTemplateIds] = React.useState<
    string[]
  >([]);
  const [filterType, setFilterType] = React.useState<
    "all" | "food" | "beverage"
  >("all");

  // Filter templates based on type
  const filteredTemplates = React.useMemo(() => {
    const beverageCategories = [
      "cold-beverages",
      "hot-beverages",
      "alcoholic-beverages",
    ];

    switch (filterType) {
      case "food":
        return templates.filter((t) => !beverageCategories.includes(t.id));
      case "beverage":
        return templates.filter((t) => beverageCategories.includes(t.id));
      default:
        return templates;
    }
  }, [templates, filterType]);

  const handleTemplateToggle = (templateId: string) => {
    setSelectedTemplateIds((prev) =>
      prev.includes(templateId)
        ? prev.filter((id) => id !== templateId)
        : [...prev, templateId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTemplateIds.length === filteredTemplates.length) {
      setSelectedTemplateIds([]);
    } else {
      setSelectedTemplateIds(filteredTemplates.map((t) => t.id));
    }
  };

  const handleNext = () => {
    const selectedTemplates = filteredTemplates.filter((t) =>
      selectedTemplateIds.includes(t.id)
    );
    onNext(selectedTemplates);
  };

  const selectedCount = selectedTemplateIds.length;
  const totalItems = filteredTemplates
    .filter((t) => selectedTemplateIds.includes(t.id))
    .reduce((sum, t) => sum + t.items.length, 0);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Choose Category Templates</h2>
          <p className="text-muted-foreground">
            Select the categories you want to add to your menu
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleSelectAll} className="h-9">
            {selectedTemplateIds.length === filteredTemplates.length ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Unselect All
              </>
            ) : (
              "Select All"
            )}
          </Button>
          {selectedCount > 0 && (
            <Badge variant="secondary" className="px-3 py-1">
              {selectedCount} categories selected
            </Badge>
          )}
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground mr-2">
          Filter by type:
        </span>
        <Button
          variant={filterType === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterType("all")}
        >
          All ({templates.length})
        </Button>
        <Button
          variant={filterType === "food" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterType("food")}
        >
          Food (
          {
            templates.filter(
              (t) =>
                ![
                  "cold-beverages",
                  "hot-beverages",
                  "alcoholic-beverages",
                ].includes(t.id)
            ).length
          }
          )
        </Button>
        <Button
          variant={filterType === "beverage" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilterType("beverage")}
        >
          Beverages (
          {
            templates.filter((t) =>
              [
                "cold-beverages",
                "hot-beverages",
                "alcoholic-beverages",
              ].includes(t.id)
            ).length
          }
          )
        </Button>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => {
          const isSelected = selectedTemplateIds.includes(template.id);
          const IconComponent = template.icon;

          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? "ring-2 ring-primary bg-primary/5"
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleTemplateToggle(template.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-md ${
                        isSelected ? "bg-primary text-white" : "bg-muted"
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base font-medium">
                        {template.name}
                      </CardTitle>
                    </div>
                  </div>
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleTemplateToggle(template.id)}
                    className="mt-1"
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-3">
                  {template.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {template.items.length} items
                  </Badge>
                  {isSelected && (
                    <div className="flex items-center text-primary text-sm font-medium">
                      <Check className="h-4 w-4 mr-1" />
                      Selected
                    </div>
                  )}
                </div>

                {/* Preview some items */}
                <div className="mt-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Sample items:
                  </p>
                  <div className="text-xs text-muted-foreground">
                    {template.items
                      .slice(0, 3)
                      .map((item) => item.name)
                      .join(", ")}
                    {template.items.length > 3 &&
                      ` +${template.items.length - 3} more`}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary and Action */}
      {selectedCount > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Ready to add items</p>
                <p className="text-sm text-muted-foreground">
                  {selectedCount} categories with {totalItems} template items to
                  review
                </p>
              </div>
              <Button onClick={handleNext} className="gap-2">
                Next: Select Items
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {selectedCount === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Select categories to get started with your menu setup
              </p>
              <p className="text-sm text-muted-foreground">
                You can always add custom categories later
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
