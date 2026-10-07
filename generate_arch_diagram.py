import matplotlib.pyplot as plt
import matplotlib.patches as patches

def generate_architecture_diagram():
    fig, ax = plt.subplots(figsize=(14, 8), dpi=300)
    ax.set_facecolor('#f8fafc')
    fig.patch.set_facecolor('#f8fafc')

    # Remove axes
    ax.set_xlim(0, 14)
    ax.set_ylim(0, 8.5)
    ax.axis('off')

    # Styles
    box_blue = dict(boxstyle="round,pad=0.5,rounding_size=0.3", fc="#eef2ff", ec="#6366f1", lw=2)
    box_purple = dict(boxstyle="round,pad=0.5,rounding_size=0.3", fc="#f5f3ff", ec="#8b5cf6", lw=2)
    box_emerald = dict(boxstyle="round,pad=0.5,rounding_size=0.3", fc="#ecfdf5", ec="#10b981", lw=2)
    box_white = dict(boxstyle="round,pad=0.4,rounding_size=0.2", fc="#ffffff", ec="#cbd5e1", lw=1.5)

    # 1. LAYER HEADERS (Containers)
    # Container 1: Client Layer
    rect1 = patches.FancyBboxPatch((0.6, 5.6), 12.8, 2.3, boxstyle="round,pad=0.2,rounding_size=0.3",
                                  facecolor='#ffffff', edgecolor='#6366f1', linewidth=2, linestyle='--')
    ax.add_patch(rect1)
    ax.text(0.9, 7.55, "1. PRESENTATION / CLIENT LAYER (React 18 + Vite)", fontsize=13, fontweight='bold', color='#4338ca')

    # Client Components
    client_boxes = [
        ("Dashboard & Reports UI\n• Real-Time Summary Cards\n• Visual Budget vs Actual\n• Category Utilization", 1.0, 5.9, 2.8, 1.4),
        ("Expense & Income Manager\n• Add/Edit/Delete Records\n• Interactive Data Tables\n• Status Badges", 4.1, 5.9, 2.8, 1.4),
        ("Budgets & Categories\n• Monthly Threshold Caps\n• Dynamic Category Labels\n• Real-Time Filters", 7.2, 5.9, 2.8, 1.4),
        ("Auth & Session State\n• Split-Screen Auth\n• Client-Side Persistence\n• Fast REST API Client", 10.3, 5.9, 2.8, 1.4)
    ]
    for text, x, y, w, h in client_boxes:
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.2,rounding_size=0.2", facecolor='#f8fafc', edgecolor='#c7d2fe', lw=1.5)
        ax.add_patch(rect)
        ax.text(x + 0.15, y + 0.7, text, fontsize=9.5, color='#1e293b', va='center')

    # Container 2: Processing & Intelligence Layer (Backend)
    rect2 = patches.FancyBboxPatch((0.6, 2.9), 12.8, 2.3, boxstyle="round,pad=0.2,rounding_size=0.3",
                                  facecolor='#ffffff', edgecolor='#8b5cf6', linewidth=2, linestyle='--')
    ax.add_patch(rect2)
    ax.text(0.9, 4.85, "2. API & INTELLIGENCE PROCESSING LAYER (Node.js + Express.js REST APIs)", fontsize=13, fontweight='bold', color='#6d28d9')

    backend_boxes = [
        ("Modular REST Routers\n• /expenses, /income\n• /categories, /budgets\n• /reports, /health", 1.0, 3.2, 2.8, 1.4),
        ("Automated Categorization\n• Pattern & Keyword Parsing\n• Merchant Rule Mapping\n• 80% Effort Reduction", 4.1, 3.2, 2.8, 1.4),
        ("Recurring Detection Engine\n• Delta-Time Clustering\n• Subscription Intervals\n• Advance Due Warnings", 7.2, 3.2, 2.8, 1.4),
        ("Predictive Forecasting\n• Moving-Average Analysis\n• Velocity Extrapolation\n• Adaptive Budget Advice", 10.3, 3.2, 2.8, 1.4)
    ]
    for text, x, y, w, h in backend_boxes:
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.2,rounding_size=0.2", facecolor='#faf5ff', edgecolor='#ddd6fe', lw=1.5)
        ax.add_patch(rect)
        ax.text(x + 0.15, y + 0.7, text, fontsize=9.5, color='#1e293b', va='center')

    # Container 3: Database Layer (MongoDB)
    rect3 = patches.FancyBboxPatch((0.6, 0.4), 12.8, 2.1, boxstyle="round,pad=0.2,rounding_size=0.3",
                                  facecolor='#ffffff', edgecolor='#10b981', linewidth=2, linestyle='--')
    ax.add_patch(rect3)
    ax.text(0.9, 2.15, "3. DATA STORAGE LAYER (MongoDB Compass / Document Collections)", fontsize=13, fontweight='bold', color='#047857')

    db_boxes = [
        ("Users Collection\n• userId (Number)\n• username (String)\n• password (String)", 1.0, 0.6, 2.8, 1.3),
        ("Categories Collection\n• categoryId (Number)\n• categoryName (String)\n• userId (Number)", 4.1, 0.6, 2.8, 1.3),
        ("Transactions Collection\n• id, amount, type\n• category, date, notes\n• Unified Income/Expense", 7.2, 0.6, 2.8, 1.3),
        ("Budgets Collection\n• id, month (YYYY-MM)\n• category, amount\n• Monthly Spend Limits", 10.3, 0.6, 2.8, 1.3)
    ]
    for text, x, y, w, h in db_boxes:
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.2,rounding_size=0.2", facecolor='#f0fdf4', edgecolor='#a7f3d0', lw=1.5)
        ax.add_patch(rect)
        ax.text(x + 0.15, y + 0.65, text, fontsize=9.5, color='#1e293b', va='center')

    # Arrows between Layers
    arrow_props = dict(facecolor='#6366f1', edgecolor='#4338ca', width=2, headwidth=8, headlength=7)
    # Down arrow (Client -> Backend)
    ax.annotate("", xy=(3.5, 5.25), xytext=(3.5, 5.6), arrowprops=arrow_props)
    ax.text(3.6, 5.38, "HTTP/JSON Requests", fontsize=9, fontweight='bold', color='#4338ca')
    
    # Up arrow (Backend -> Client)
    arrow_props_up = dict(facecolor='#8b5cf6', edgecolor='#6d28d9', width=2, headwidth=8, headlength=7)
    ax.annotate("", xy=(9.5, 5.6), xytext=(9.5, 5.25), arrowprops=arrow_props_up)
    ax.text(9.6, 5.38, "JSON Responses", fontsize=9, fontweight='bold', color='#6d28d9')

    # Down arrow (Backend -> DB)
    arrow_props_db = dict(facecolor='#10b981', edgecolor='#047857', width=2, headwidth=8, headlength=7)
    ax.annotate("", xy=(3.5, 2.55), xytext=(3.5, 2.9), arrowprops=arrow_props_db)
    ax.text(3.6, 2.68, "Mongoose Queries / Writes", fontsize=9, fontweight='bold', color='#047857')

    # Up arrow (DB -> Backend)
    ax.annotate("", xy=(9.5, 2.9), xytext=(9.5, 2.55), arrowprops=arrow_props_db)
    ax.text(9.6, 2.68, "Aggregated Documents", fontsize=9, fontweight='bold', color='#047857')

    plt.tight_layout()
    plt.savefig('architecture_diagram.png', dpi=300, bbox_inches='tight')
    plt.close()
    print("architecture_diagram.png created successfully!")

if __name__ == "__main__":
    generate_architecture_diagram()

