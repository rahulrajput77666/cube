import { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import BusinessIcon from "@mui/icons-material/Business";
// removed StarIcon/Rating to keep UI simple (numeric values only)
import orgHierarchy from "../../mocks/mockOrgStructure";

const roleStyles = {
  "Vice President": { bgcolor: "#E0EBFF", color: "#1E40AF" },
  Manager: { bgcolor: "#E9F5FF", color: "#1D4ED8" },
  "Team Lead": { bgcolor: "#EFF6FF", color: "#2563EB" },
  Employee: { bgcolor: "#F8FAFC", color: "#0F172A" },
};

const flattenNodes = (nodes) => {
  const all = [];
  const walk = (items, parent = null) => {
    items.forEach((item) => {
      all.push({ ...item, parent });
      if (item.children?.length) {
        walk(item.children, item);
      }
    });
  };
  walk(nodes);
  return all;
};

const countEmployees = (node) => {
  if (!node.children?.length) {
    return node.role === "Employee" ? 1 : 0;
  }
  return node.children.reduce((sum, child) => sum + countEmployees(child), 0);
};

function UserManagementPage() {
  const [selectedEmployee, setSelectedEmployee] = useState(orgHierarchy[0]);
  const [openNodes, setOpenNodes] = useState(new Set(["vp-veena", "mgr-suresh", "mgr-guru", "mgr-santosh"]));
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    manager: "all",
    lead: "all",
    department: "all",
    minRating: "all",
    minExperience: "all",
  });

  const allNodes = useMemo(() => flattenNodes(orgHierarchy), []);

  const managers = useMemo(
    () => [...new Set(allNodes.filter((item) => item.role === "Manager").map((item) => item.name))],
    [allNodes]
  );

  const leads = useMemo(
    () => [...new Set(allNodes.filter((item) => item.role === "Team Lead").map((item) => item.name))],
    [allNodes]
  );

  const departments = useMemo(
    () => [...new Set(allNodes.map((item) => item.department).filter(Boolean))],
    [allNodes]
  );

  const totalEmployees = useMemo(
    () => allNodes.filter((item) => item.role === "Employee").length,
    [allNodes]
  );

  const totalLeads = useMemo(
    () => allNodes.filter((item) => item.role === "Team Lead").length,
    [allNodes]
  );

  const totalManagers = useMemo(
    () => allNodes.filter((item) => item.role === "Manager").length,
    [allNodes]
  );

  const averageRating = useMemo(() => {
    const employees = allNodes.filter((item) => item.role === "Employee");
    if (!employees.length) return 0;
    return employees.reduce((sum, item) => sum + item.ratingAvg, 0) / employees.length;
  }, [allNodes]);

  const handleNodeToggle = (id) => {
    setOpenNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const matchesFilter = (node) => {
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !search ||
      [node.name, node.employeeId, node.manager, node.reportingLead, node.role, node.department]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(search));

    const matchesManager =
      filters.manager === "all" ||
      node.name === filters.manager ||
      node.manager === filters.manager ||
      node.reportingLead === filters.manager;

    const matchesLead =
      filters.lead === "all" ||
      node.name === filters.lead ||
      node.manager === filters.lead ||
      node.reportingLead === filters.lead;

    const matchesDepartment =
      filters.department === "all" || node.department === filters.department;

    const matchesRating =
      filters.minRating === "all" || node.ratingAvg >= Number(filters.minRating);

    const matchesExperience =
      filters.minExperience === "all" || node.experience >= Number(filters.minExperience);

    return (
      matchesSearch &&
      matchesManager &&
      matchesLead &&
      matchesDepartment &&
      matchesRating &&
      matchesExperience
    );
  };

  const filterNode = (node) => {
    const children = node.children?.map(filterNode).filter(Boolean) || [];
    const selfMatch = matchesFilter(node);
    if (selfMatch || children.length) {
      return { ...node, children };
    }
    return null;
  };

  const filteredHierarchy = useMemo(
    () => orgHierarchy.map(filterNode).filter(Boolean),
    [searchTerm, filters]
  );

  // Helpers to build a perspective view: show manager chain (ancestors)
  // leading to the selected employee, and the selected employee's subtree (descendants).
  const findPathToNode = (nodes, id) => {
    let path = null;
    const walk = (items, acc = []) => {
      for (const item of items) {
        const nextAcc = [...acc, item];
        if (item.id === id) {
          path = nextAcc;
          return true;
        }
        if (item.children?.length && walk(item.children, nextAcc)) return true;
      }
      return false;
    };
    walk(nodes);
    return path || [];
  };

  const perspectiveHierarchy = useMemo(() => {
    const selectedId = selectedEmployee?.id;
    if (!selectedId) return orgHierarchy.map((n) => ({ ...n }));

    const path = findPathToNode(orgHierarchy, selectedId);
    if (!path.length) return orgHierarchy.map((n) => ({ ...n }));

    // Build trimmed tree: start from the top-most ancestor in path
    const build = (idx) => {
      const node = path[idx];
      const isLast = idx === path.length - 1;
      const branchChildId = !isLast ? path[idx + 1].id : null;
      const cloned = { ...node };
      if (isLast) {
        // include full subtree under selected
        cloned.children = node.children?.map((c) => ({ ...c })) || [];
      } else {
        // keep only the branch child that leads to selected
        cloned.children = node.children
          ? node.children
              .filter((c) => c.id === branchChildId)
              .map((c) => ({ ...build(idx + 1) }))
          : [];
      }
      return cloned;
    };

    return [build(0)];
  }, [selectedEmployee]);

  const renderTree = (nodes, level = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children?.length > 0;
      const isOpen = openNodes.has(node.id);
      const selected = selectedEmployee?.id === node.id;
      const directReportCount = node.children?.length || 0;
      const teamSize = countEmployees(node);

      return (
        <Box key={`${node.id}-${level}`} sx={{ mb: 1, pl: level * 2, position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              p: 1.5,
              borderRadius: 3,
              bgcolor: selected ? "rgba(37,99,235,0.08)" : "#fff",
              boxShadow: selected ? "0 10px 24px rgba(37,99,235,0.12)" : "0 1px 2px rgba(15,23,42,0.08)",
              cursor: "pointer",
              transition: "transform 150ms ease, box-shadow 150ms ease",
              border: selected ? "1px solid rgba(37,99,235,0.32)" : "1px solid transparent",
            }}
            onClick={() => setSelectedEmployee(node)}
          >
            {hasChildren ? (
              <IconButton
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  handleNodeToggle(node.id);
                }}
              >
                {isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowRightIcon />}
              </IconButton>
            ) : (
              <Box sx={{ width: 36 }} />
            )}

            <Avatar sx={{ bgcolor: "#2563EB", width: 40, height: 40, fontSize: 16 }}>
              {node.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}
            </Avatar>

            <Box sx={{ minWidth: 180, flex: 1 }}>
              <Typography fontWeight={700}>{node.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {node.role} • {node.title}
              </Typography>
            </Box>

            <Chip label={node.role} size="small" sx={roleStyles[node.role] || {}} />

            <Box sx={{ textAlign: "right", minWidth: 90 }}>
              <Typography variant="caption" color="text.secondary">
                {hasChildren ? `${directReportCount} Reports` : "Individual"}
              </Typography>
              {teamSize > 0 && (
                <Typography variant="body2" fontWeight={600}>
                  {teamSize} on team
                </Typography>
              )}
            </Box>
          </Box>

          {hasChildren && (
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
              <Box sx={{ mt: 1 }}>{renderTree(node.children, level + 1)}</Box>
            </Collapse>
          )}
        </Box>
      );
    });
  };

  const selectedDetails = selectedEmployee || orgHierarchy[0];

  return (
    <Box sx={{ px: 5, py: 4 }}>
      <Box sx={{ mb: 4, display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="h4" fontWeight={700}>
          Organizational Performance Dashboard
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 720 }}>
          A hierarchical view of leadership, reporting relationships, employee performance, and project review history for the HR admin team.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                Employees
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                {totalEmployees}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                Leads
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                {totalLeads}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                Managers
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                {totalManagers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                Average Rating
              </Typography>
              <Typography variant="h4" fontWeight={800} sx={{ mt: 1 }}>
                {averageRating.toFixed(1)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3, alignItems: "center" }}>
        <TextField
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by Employee, Lead, Manager, or ID"
          fullWidth
          sx={{ minWidth: 320 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="disabled" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 180 }}>
          <Select
            value={filters.manager}
            onChange={(event) => setFilters((prev) => ({ ...prev, manager: event.target.value }))}
            displayEmpty
          >
            <MenuItem value="all">All Managers</MenuItem>
            {managers.map((manager) => (
              <MenuItem key={manager} value={manager}>
                {manager}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 180 }}>
          <Select
            value={filters.lead}
            onChange={(event) => setFilters((prev) => ({ ...prev, lead: event.target.value }))}
            displayEmpty
          >
            <MenuItem value="all">All Leads</MenuItem>
            {leads.map((lead) => (
              <MenuItem key={lead} value={lead}>
                {lead}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 160 }}>
          <Select
            value={filters.department}
            onChange={(event) => setFilters((prev) => ({ ...prev, department: event.target.value }))}
            displayEmpty
          >
            <MenuItem value="all">All Departments</MenuItem>
            {departments.map((department) => (
              <MenuItem key={department} value={department}>
                {department}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 160 }}>
          <Select
            value={filters.minRating}
            onChange={(event) => setFilters((prev) => ({ ...prev, minRating: event.target.value }))}
            displayEmpty
          >
            <MenuItem value="all">Rating 3.5+</MenuItem>
            <MenuItem value="3.5">3.5+</MenuItem>
            <MenuItem value="4.0">4.0+</MenuItem>
            <MenuItem value="4.5">4.5+</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 160 }}>
          <Select
            value={filters.minExperience}
            onChange={(event) => setFilters((prev) => ({ ...prev, minExperience: event.target.value }))}
            displayEmpty
          >
            <MenuItem value="all">Experience All</MenuItem>
            <MenuItem value="2">2+ yrs</MenuItem>
            <MenuItem value="4">4+ yrs</MenuItem>
            <MenuItem value="6">6+ yrs</MenuItem>
            <MenuItem value="10">10+ yrs</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={5}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <BusinessIcon sx={{ color: "#2563EB", fontSize: 32 }} />
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Organization Hierarchy
                </Typography>
                <Typography color="text.secondary">
                  Expand nodes to see managers, leads and employees in the reporting chain.
                </Typography>
              </Box>
            </Box>
            {perspectiveHierarchy.length ? (
              renderTree(perspectiveHierarchy)
            ) : (
              <Typography color="text.secondary">No matching records found for selected filters.</Typography>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Employee Performance Dashboard
                </Typography>
                <Typography color="text.secondary">Review the selected employee’s profile and annual ratings.</Typography>
              </Box>
              <Avatar sx={{ bgcolor: "#2563EB", width: 48, height: 48 }}>
                {selectedDetails.name.split(" ").map((word) => word[0]).join("").slice(0, 2)}
              </Avatar>
            </Box>

            <Typography variant="h5" fontWeight={700}>
              {selectedDetails.name}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              {selectedDetails.title} • {selectedDetails.department}
            </Typography>

            <Grid container spacing={1} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Card sx={{ bgcolor: "#F8FAFC", p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Reporting Lead
                  </Typography>
                  <Typography fontWeight={700}>{selectedDetails.reportingLead || selectedDetails.manager || "—"}</Typography>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ bgcolor: "#F8FAFC", p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Experience
                  </Typography>
                  <Typography fontWeight={700}>{selectedDetails.experience} yrs</Typography>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ bgcolor: "#F8FAFC", p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Employee ID
                  </Typography>
                  <Typography fontWeight={700}>{selectedDetails.employeeId}</Typography>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card sx={{ bgcolor: "#F8FAFC", p: 2, borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Avg Rating
                  </Typography>
                  <Typography fontWeight={700}>{selectedDetails.ratingAvg?.toFixed(1) || "—"}</Typography>
                </Card>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 2 }} />

            <Box>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
                Annual Ratings
              </Typography>
                {selectedDetails.reviewRatings?.map((rating) => (
                  <Box key={rating.year} sx={{ mb: 2, p: 2, bgcolor: "#F8FAFC", borderRadius: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography fontWeight={700}>{rating.year}</Typography>
                      <Typography color="text.secondary">{rating.rating.toFixed(1)}</Typography>
                    </Box>
                    <Typography variant="body2">Summary: {rating.notes || "—"}</Typography>
                  </Box>
                ))}
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} lg={3}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Project Review History
                </Typography>
                <Typography color="text.secondary">The selected employee’s recent project performance.</Typography>
              </Box>
            </Box>

            {selectedDetails.projects?.map((project) => (
              <Box key={project.name} sx={{ mb: 2, p: 2, bgcolor: "#F8FAFC", borderRadius: 2 }}>
                <Typography fontWeight={700}>{project.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {project.duration}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Typography color="text.secondary">Rating</Typography>
                  <Typography fontWeight={700}>{project.rating.toFixed(1)}</Typography>
                </Box>
              </Box>
            ))}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserManagementPage;
