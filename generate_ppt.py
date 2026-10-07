import collections
import collections.abc
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 widescreen layout
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    blank_layout = prs.slide_layouts[6]

    # Colors
    NAVY_DARK = RGBColor(15, 23, 42)       # #0f172a
    NAVY_CARD = RGBColor(30, 41, 59)       # #1e293b
    INDIGO = RGBColor(99, 102, 241)        # #6366f1
    EMERALD = RGBColor(16, 185, 129)       # #10b981
    ROSE = RGBColor(244, 63, 94)           # #f43f5e
    CYAN = RGBColor(56, 189, 248)          # #38bdf8
    WHITE = RGBColor(255, 255, 255)
    LIGHT_BG = RGBColor(248, 250, 252)     # #f8fafc
    SLATE_TEXT = RGBColor(30, 41, 59)      # #1e293b
    MUTED_TEXT = RGBColor(100, 116, 139)   # #64748b
    CARD_BG = RGBColor(255, 255, 255)
    CARD_BORDER = RGBColor(226, 232, 240)

    def set_slide_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.color.rgb = color
        return bg

    def add_header(slide, tag_text, title_text, dark=False):
        # Category Tag / Pill
        tag_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.4))
        tf_tag = tag_box.text_frame
        tf_tag.word_wrap = True
        p_tag = tf_tag.paragraphs[0]
        p_tag.text = tag_text.upper()
        p_tag.font.size = Pt(11)
        p_tag.font.bold = True
        p_tag.font.color.rgb = CYAN if dark else INDIGO

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.7), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.size = Pt(26)
        p_title.font.bold = True
        p_title.font.color.rgb = WHITE if dark else NAVY_DARK

    def add_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.2)
        return card

    # ==========================================================
    # SLIDE 1: TITLE SLIDE (Dark Luxury Theme)
    # ==========================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1, NAVY_DARK)

    # Accent top bar
    bar = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.2), Inches(1.2), Inches(0.08))
    bar.fill.solid()
    bar.fill.fore_color.rgb = CYAN
    bar.line.fill.background()

    # Title box
    tbox = s1.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.7), Inches(2.8))
    tf1 = tbox.text_frame
    tf1.word_wrap = True
    
    p = tf1.paragraphs[0]
    p.text = "PERSONAL EXPENSE MANAGEMENT SYSTEM"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = WHITE

    p2 = tf1.add_paragraph()
    p2.text = "With Automated Categorization, Recurring Expense Detection & Predictive Budget Forecasting"
    p2.font.size = Pt(20)
    p2.font.bold = True
    p2.font.color.rgb = CYAN
    p2.space_before = Pt(14)

    # Feature badges in title slide
    features = [
        ("✦ Automated Categorization", "Rule & Pattern Matching"),
        ("✦ Recurring Detection", "Subscription & Cycle Tracking"),
        ("✦ Predictive Budgeting", "Trend-Based Forecasting"),
        ("✦ MERN Architecture", "MongoDB • Express • React • Node")
    ]
    card_w = Inches(2.7)
    card_h = Inches(1.3)
    start_x = Inches(0.8)
    gap = Inches(0.3)
    for i, (f_title, f_sub) in enumerate(features):
        cx = start_x + i * (card_w + gap)
        add_card(s1, cx, Inches(4.5), card_w, card_h, bg_color=NAVY_CARD, border_color=INDIGO)
        tb = s1.shapes.add_textbox(cx + Inches(0.15), Inches(4.6), card_w - Inches(0.3), card_h - Inches(0.2))
        tframe = tb.text_frame
        tframe.word_wrap = True
        p_ft = tframe.paragraphs[0]
        p_ft.text = f_title
        p_ft.font.size = Pt(13)
        p_ft.font.bold = True
        p_ft.font.color.rgb = WHITE
        
        p_fs = tframe.add_paragraph()
        p_fs.text = f_sub
        p_fs.font.size = Pt(11)
        p_fs.font.color.rgb = MUTED_TEXT
        p_fs.space_before = Pt(4)

    # Footer presenter note
    foot_box = s1.shapes.add_textbox(Inches(0.8), Inches(6.3), Inches(11.7), Inches(0.6))
    p_foot = foot_box.text_frame.paragraphs[0]
    p_foot.text = "Project Presentation  |  Department of Information Technology  |  MERN Stack Project"
    p_foot.font.size = Pt(12)
    p_foot.font.color.rgb = MUTED_TEXT

    # ==========================================================
    # SLIDE 2: PROBLEM STATEMENT
    # ==========================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2, LIGHT_BG)
    add_header(s2, "Challenge & Context", "Problem Statement")

    problems = [
        ("High Friction of Manual Entry", 
         "Traditional apps force consumers to manually input, calculate, and tag every single expense. This high cognitive burden causes over 70% of users to abandon tracking within weeks."),
        
        ("Unnoticed Recurring Subscriptions", 
         "Modern consumer spending consists of silent periodic deductions (streaming, gym, software, memberships). Lack of automated cycle detection leads to surprise renewals and recurring financial leaks."),
        
        ("Rigid & Static Budgeting", 
         "Standard budgets are fixed numbers created arbitrarily without considering previous spending dynamics, leading to unrealistic targets that fail to warn users before budget breaches occur."),
        
        ("Lack of Predictive Foresight", 
         "Existing solutions only offer retrospective views (what was already spent) rather than prospective forecasts (projected end-of-month expenditure), leaving users vulnerable to month-end deficits.")
    ]

    card_w2 = Inches(5.6)
    card_h2 = Inches(2.2)
    positions = [
        (Inches(0.8), Inches(1.8)),
        (Inches(6.8), Inches(1.8)),
        (Inches(0.8), Inches(4.3)),
        (Inches(6.8), Inches(4.3)),
    ]

    for (title, desc), (pos_x, pos_y) in zip(problems, positions):
        add_card(s2, pos_x, pos_y, card_w2, card_h2)
        tb = s2.shapes.add_textbox(pos_x + Inches(0.25), pos_y + Inches(0.2), card_w2 - Inches(0.5), card_h2 - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = f"⚠  {title}"
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = ROSE
        
        p_desc = tf.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(13)
        p_desc.font.color.rgb = SLATE_TEXT
        p_desc.space_before = Pt(8)

    # ==========================================================
    # SLIDE 3: ABSTRACT
    # ==========================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3, LIGHT_BG)
    add_header(s3, "Executive Summary", "Project Abstract")

    # Main Abstract Box (Left)
    add_card(s3, Inches(0.8), Inches(1.8), Inches(7.5), Inches(4.8))
    tb_abs = s3.shapes.add_textbox(Inches(1.1), Inches(2.0), Inches(6.9), Inches(4.4))
    tf_abs = tb_abs.text_frame
    tf_abs.word_wrap = True

    p = tf_abs.paragraphs[0]
    p.text = "System Overview & Innovation"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = NAVY_DARK

    p_body = tf_abs.add_paragraph()
    p_body.text = (
        "Personal expense management is vital for financial health, yet conventional tracking mechanisms suffer "
        "from tedious manual entry, retrospective reporting, and inability to anticipate financial commitments.\n\n"
        "This project presents an intelligent, full-stack Personal Expense Management System built on the MERN "
        "(MongoDB, Express, React, Node.js) architecture. The upgraded platform introduces three core automated paradigms:\n\n"
        "1. Automated Transaction Categorization utilizing rule-based keyword extraction.\n"
        "2. Recurring Expense Detection using interval and variance analysis to track subscriptions.\n"
        "3. Predictive Budget Forecasting that models past consumption patterns to recommend dynamic, realistic budget thresholds.\n\n"
        "The system delivers real-time analytics, automated alerts, and full CRUD control, providing consumers with "
        "effortless financial clarity and actionable foresight."
    )
    p_body.font.size = Pt(13.5)
    p_body.font.color.rgb = SLATE_TEXT
    p_body.space_before = Pt(10)

    # Highlights (Right Cards)
    highlights = [
        ("🎯 Target Users", "Individual consumers seeking automated, hassle-free personal budgeting."),
        ("⚡ Core Architecture", "MERN Stack (MongoDB Compass, Express.js REST APIs, React 18, Node.js)."),
        ("💡 Core Value", "Shifts finance tracking from passive bookkeeping to proactive decision-making.")
    ]
    card_h_r = Inches(1.45)
    for i, (h_title, h_desc) in enumerate(highlights):
        ry = Inches(1.8) + i * (card_h_r + Inches(0.22))
        add_card(s3, Inches(8.6), ry, Inches(3.9), card_h_r, bg_color=WHITE, border_color=INDIGO)
        tb_r = s3.shapes.add_textbox(Inches(8.8), ry + Inches(0.15), Inches(3.5), card_h_r - Inches(0.3))
        tf_r = tb_r.text_frame
        tf_r.word_wrap = True
        pr1 = tf_r.paragraphs[0]
        pr1.text = h_title
        pr1.font.size = Pt(14)
        pr1.font.bold = True
        pr1.font.color.rgb = INDIGO
        
        pr2 = tf_r.add_paragraph()
        pr2.text = h_desc
        pr2.font.size = Pt(12)
        pr2.font.color.rgb = SLATE_TEXT
        pr2.space_before = Pt(4)

    # ==========================================================
    # SLIDE 4: OBJECTIVES
    # ==========================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4, LIGHT_BG)
    add_header(s4, "Goals & Deliverables", "Project Objectives")

    objectives = [
        ("1. Automated Categorization", "Develop a classification engine that assigns incoming expenses into standardized categories (Food, Utilities, Travel) based on merchant & description patterns without manual tagging."),
        ("2. Recurring Expense Detection", "Implement cycle-detection algorithms to automatically identify recurring obligations (Netflix, Rent, WiFi, EMI) and flag them with expected billing cycles."),
        ("3. Predictive Budget Forecasting", "Synthesize historical expenditure data to forecast anticipated monthly requirements and dynamically advise realistic category-wise budget caps."),
        ("4. Consumer-First Dashboard", "Deliver an interactive, responsive React interface offering real-time budget vs. actual progress indicators, net savings calculation, and visual status alerts."),
        ("5. Robust & Scalable Backend", "Engineer an asynchronous modular REST API using Express.js and MongoDB with structured schema validations for users, categories, transactions, and budgets.")
    ]

    card_w4 = Inches(11.7)
    card_h4 = Inches(0.85)
    start_y4 = Inches(1.7)
    for i, (obj_title, obj_desc) in enumerate(objectives):
        cy = start_y4 + i * (card_h4 + Inches(0.15))
        add_card(s4, Inches(0.8), cy, card_w4, card_h4)
        tb = s4.shapes.add_textbox(Inches(1.0), cy + Inches(0.1), card_w4 - Inches(0.4), card_h4 - Inches(0.2))
        tf = tb.text_frame
        tf.word_wrap = True
        p_t = tf.paragraphs[0]
        p_t.text = obj_title
        p_t.font.size = Pt(14)
        p_t.font.bold = True
        p_t.font.color.rgb = INDIGO
        
        p_d = tf.add_paragraph()
        p_d.text = obj_desc
        p_d.font.size = Pt(12)
        p_d.font.color.rgb = SLATE_TEXT
        p_d.space_before = Pt(2)

    # ==========================================================
    # SLIDE 5: EXISTING SOLUTION & LIMITATIONS
    # ==========================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5, LIGHT_BG)
    add_header(s5, "Current Landscape", "Existing Solutions vs. Limitations")

    col_w = Inches(5.6)
    
    # Left Column: Existing Solutions
    add_card(s5, Inches(0.8), Inches(1.8), col_w, Inches(4.8))
    tb_ex = s5.shapes.add_textbox(Inches(1.1), Inches(2.0), col_w - Inches(0.6), Inches(4.4))
    tf_ex = tb_ex.text_frame
    tf_ex.word_wrap = True
    
    p = tf_ex.paragraphs[0]
    p.text = "Existing Methods in Market"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = NAVY_DARK

    ex_points = [
        ("Spreadsheet Templates (Excel / Sheets):", "Requires manual recording of amounts, dates, and formulas. No automation, no mobile-first alerts, error-prone."),
        ("Traditional Mobile Trackers:", "Basic CRUD apps that still require manual category selection on each entry. Lack intelligence and context."),
        ("Bank Statement Exports:", "Raw transactional statements that arrive at month-end without forward-looking budgeting or proactive warnings.")
    ]
    for title, desc in ex_points:
        pt = tf_ex.add_paragraph()
        pt.text = f"•  {title} " + desc
        pt.font.size = Pt(13)
        pt.font.color.rgb = SLATE_TEXT
        pt.space_before = Pt(14)

    # Right Column: Critical Limitations
    add_card(s5, Inches(6.8), Inches(1.8), col_w, Inches(4.8), bg_color=WHITE, border_color=ROSE)
    tb_lim = s5.shapes.add_textbox(Inches(7.1), Inches(2.0), col_w - Inches(0.6), Inches(4.4))
    tf_lim = tb_lim.text_frame
    tf_lim.word_wrap = True

    p = tf_lim.paragraphs[0]
    p.text = "Key Limitations & Drawbacks"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = ROSE

    lim_points = [
        ("100% Manual Effort:", "Zero automatic classification leads to user fatigue and incomplete records."),
        ("No Recurring Awareness:", "Subscriptions go unnoticed until the user reviews bank deductions weeks later."),
        ("Static Unresponsive Budgets:", "No adaptive forecasting based on past seasonal or month-to-month lifestyle shifts."),
        ("Retrospective Only:", "Shows where money went in the past; gives zero insight into projected month-end balances.")
    ]
    for title, desc in lim_points:
        pt = tf_lim.add_paragraph()
        pt.text = f"✕  {title} " + desc
        pt.font.size = Pt(13)
        pt.font.color.rgb = SLATE_TEXT
        pt.space_before = Pt(14)

    # ==========================================================
    # SLIDE 6: PROPOSED SOLUTION
    # ==========================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6, LIGHT_BG)
    add_header(s6, "Upgraded Approach", "Proposed Solution & Methodology")

    solutions = [
        ("Automated Categorization",
         "EMERALD",
         "The system scans transaction descriptions and auto-maps them to categories (e.g., 'Uber' -> Travel, 'KFC' -> Food, 'EB Bill' -> Utilities) using an extensible keyword mapping engine, cutting manual entry by 80%."),
        
        ("Recurring Expense Detection",
         "INDIGO",
         "Analyzes transaction intervals and amounts to isolate repeating periodic expenses (Netflix, Spotify, Rent). The system tags recurring streams and projects upcoming due dates."),
        
        ("Predictive Budget Forecasting",
         "CYAN",
         "Replaces static guessing with intelligent moving-average forecasting. By evaluating spending velocity from previous cycles, the system predicts anticipated expenses and suggests realistic budget caps."),
        
        ("Real-Time Visual Control",
         "EMERALD",
         "An interactive React dashboard displays color-coded utilization progress bars, remaining budget metrics, and instantaneous over-budget alerts (Within Budget vs. Over Budget).")
    ]

    for (stitle, scolor, sdesc), (pos_x, pos_y) in zip(solutions, positions):
        border_c = EMERALD if scolor == "EMERALD" else INDIGO
        add_card(s6, pos_x, pos_y, card_w2, card_h2, bg_color=WHITE, border_color=border_c)
        tb = s6.shapes.add_textbox(pos_x + Inches(0.25), pos_y + Inches(0.2), card_w2 - Inches(0.5), card_h2 - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = f"✓  {stitle}"
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = border_c
        
        p_desc = tf.add_paragraph()
        p_desc.text = sdesc
        p_desc.font.size = Pt(13)
        p_desc.font.color.rgb = SLATE_TEXT
        p_desc.space_before = Pt(8)

    # ==========================================================
    # SLIDE 7: ARCHITECTURE & METHODOLOGY
    # ==========================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7, LIGHT_BG)
    add_header(s7, "Technical Implementation", "System Architecture & Data Flow")

    arch_cards = [
        ("1. Frontend Layer (React 18)", 
         "• Modular component hierarchy (Auth, Expenses, Income, Categories, Budgets, Reports).\n• Real-time state synchronization using React Hooks.\n• Interactive progress bars & dynamic month selectors."),
        
        ("2. Backend API Layer (Express.js)", 
         "• Modular RESTful route controllers with Async/Await.\n• Categorization & recurring detection service handlers.\n• Forecasting aggregation pipelines for monthly summaries."),
        
        ("3. Database Layer (MongoDB Compass)", 
         "• Users Collection: User authentication & credential store.\n• Categories Collection: Dynamic taxonomy mapping.\n• Transactions Collection: Unified Expense/Income logs.\n• Budgets Collection: Monthly threshold limits."),
        
        ("4. Predictive & Detection Methods", 
         "• Keyword heuristic matching for automated taxonomy.\n• Delta-time clustering for recurring cycles.\n• Moving-average historical extrapolation for forecasting.")
    ]

    for (atitle, adesc), (pos_x, pos_y) in zip(arch_cards, positions):
        add_card(s7, pos_x, pos_y, card_w2, card_h2)
        tb = s7.shapes.add_textbox(pos_x + Inches(0.25), pos_y + Inches(0.2), card_w2 - Inches(0.5), card_h2 - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = atitle
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = INDIGO
        
        p_desc = tf.add_paragraph()
        p_desc.text = adesc
        p_desc.font.size = Pt(12.5)
        p_desc.font.color.rgb = SLATE_TEXT
        p_desc.space_before = Pt(8)

    # ==========================================================
    # SLIDE 8: EXPECTED OUTCOMES & IMPACT
    # ==========================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8, LIGHT_BG)
    add_header(s8, "Value & Results", "Expected Outcomes & Business Impact")

    outcomes = [
        ("80% Effort Reduction", "Automated categorization and recurring detection virtually eliminate tedious manual logging for common expenses."),
        ("Zero Surprise Renewals", "Proactive identification of recurring subscriptions ensures users are conscious of automated card billings."),
        ("Deficit Prevention", "Predictive budget forecasting alerts users when their current spending rate will exceed monthly savings goals."),
        ("Clean Consumer Experience", "Modern SaaS UI with instant responsive feedback, accessible across mobile and desktop environments.")
    ]

    for (otitle, odesc), (pos_x, pos_y) in zip(outcomes, positions):
        add_card(s8, pos_x, pos_y, card_w2, card_h2, border_color=EMERALD)
        tb = s8.shapes.add_textbox(pos_x + Inches(0.25), pos_y + Inches(0.2), card_w2 - Inches(0.5), card_h2 - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = f"★  {otitle}"
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = EMERALD
        
        p_desc = tf.add_paragraph()
        p_desc.text = odesc
        p_desc.font.size = Pt(13)
        p_desc.font.color.rgb = SLATE_TEXT
        p_desc.space_before = Pt(8)

    # ==========================================================
    # SLIDE 9: THANK YOU SLIDE (Dark Luxury Theme)
    # ==========================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9, NAVY_DARK)

    # Center card
    card_ty = add_card(s9, Inches(2.2), Inches(1.5), Inches(8.933), Inches(4.5), bg_color=NAVY_CARD, border_color=INDIGO)
    
    tb_ty = s9.shapes.add_textbox(Inches(2.5), Inches(1.9), Inches(8.333), Inches(3.7))
    tf_ty = tb_ty.text_frame
    tf_ty.word_wrap = True

    p = tf_ty.paragraphs[0]
    p.text = "THANK YOU!"
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.CENTER

    p2 = tf_ty.add_paragraph()
    p2.text = "Personal Expense Management System & Method"
    p2.font.size = Pt(18)
    p2.font.bold = True
    p2.font.color.rgb = CYAN
    p2.alignment = PP_ALIGN.CENTER
    p2.space_before = Pt(14)

    p3 = tf_ty.add_paragraph()
    p3.text = "With Automated Categorization, Recurring Expense Detection & Predictive Budget Forecasting"
    p3.font.size = Pt(13)
    p3.font.color.rgb = MUTED_TEXT
    p3.alignment = PP_ALIGN.CENTER
    p3.space_before = Pt(6)

    p4 = tf_ty.add_paragraph()
    p4.text = "Questions & Feedback Welcome 💬"
    p4.font.size = Pt(16)
    p4.font.bold = True
    p4.font.color.rgb = EMERALD
    p4.alignment = PP_ALIGN.CENTER
    p4.space_before = Pt(28)

    # Output file
    output_filename = "Personal_Expense_Management_System_Presentation.pptx"
    prs.save(output_filename)
    print(f"Presentation successfully created: {output_filename}")

if __name__ == "__main__":
    create_presentation()
