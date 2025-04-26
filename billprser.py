import pdfplumber
import re
from itertools import combinations
from multiprocessing import Pool, cpu_count
import sys

def sumcashback(included_merchants, transactions):
    return sum(transactions[m] * 0.047 for m in included_merchants)

def try_combo(args):
    combo, transactions, confirm, confirm_excluded, bonus_cashback = args
    combo_set = set(combo).union(confirm)
    if not combo_set.isdisjoint(confirm_excluded):
        return None
    cashback = round(sumcashback(combo_set, transactions), 2)
    if abs(cashback - bonus_cashback) < 0.01:
        return combo_set
    return None

def run_parallel_search(transactions, confirm, confirm_excluded, bonus_cashback):
    all_merchants = set(transactions.keys())
    unknown_merchants = all_merchants - confirm_excluded - confirm
    for r in range(len(unknown_merchants) + 1):
        combos = list(combinations(unknown_merchants, r))

        args = [(combo, transactions, confirm, confirm_excluded, bonus_cashback) for combo in combos]

        with Pool(processes=cpu_count()) as pool:
            results = pool.map(try_combo, args)

        valid_results = list(filter(None, results))
        if valid_results:
            return valid_results

    return None

if __name__ == "__main__":
    if len(sys.argv) < 2:
        exit
    transactions = {}
    bonus_cashback = 0

    with pdfplumber.open(sys.argv[1]) as pdf:
        p0 = pdf.pages[0]
        text = p0.extract_text()
        for line in text.split("\n"):
            if "SMRT$" in line:
                match = re.search(r'(?:SMRT\$)[^\d]*([\d,]+\.\d{2})', line, re.IGNORECASE)
                if match:
                    cashback_total = float(match.group(1))

        

        for page in pdf.pages:
            texts = page.extract_text()
            for idx, line in enumerate(texts.split("\n")):
                match = re.match(r'^(\d{1,2}[A-Z]{3})(.+?) (\d+\.\d{2})$', line.strip())
                if match:
                    date = match.group(1)
                    merchant = match.group(2).strip()
                    amount = float(match.group(3))
                    transactions[merchant] = transactions.get(merchant, 0.0) + amount
                if "earnedthismonth" in line and "month" in line:
                    lines = texts.split("\n")
                    if idx+1<len(lines):
                        bonus_cashback_line = lines[idx+1]
                        numbers = re.findall(r"\d+\.\d{2}", bonus_cashback_line)
                        if len(numbers) > 3:
                            bonus_cashback = float(numbers[2])
                            standard_cashback = float(numbers[1])
                            # print("bonus_cashback: " + bonus_cashback)


    confirm_excluded = set([
        "MALAYSIABOLEHJURONGPOISINGAPORE SG", "FOURLEAVES-JURONGPT SINGAPORE SG",
        "JOLLIBEE-JURONGPOINT SINGAPORE SG", "DONDONDONKI-JEM SINGAPORE SG",
        "EAT.@JURONGPOINT SINGAPORE SG", "BINGZWESTGATE SINGAPORE SG", 
        "85REDHILL-WHITESAND SINGAPORE SG", "SUSHIRO@PBC SINGAPORE SG", 
        "DONDONDONKI-JURONGPOISINGAPORE SG", "IORA-JEM SINGAPORE608SG SG", 
        "85REDHILL-WESTGATE SINGAPORE SG", "GOKOKUJAPANESEBAKERYJUSINGAPORE SG",
        "FOURLEAVES-JEM SINGAPORE SG", "BOOSTJUICEJURONGPOINTSingapore SG",
        "BOOSTJUICEJEM Singapore SG", "651JURONGWESTST12 SINGAPORE SG", "IORA-JEM SINGAPORE608SG"
    ])

    confirm = set([
        "NTUCFairPriceAppPaymenSINGAPORE SG", "FP*FOODPANDA SINGAPORE SG"
    ])

    

    best_match = run_parallel_search(transactions, confirm, confirm_excluded, bonus_cashback)

    if best_match:
        print("Match Found:")
        for m in best_match:
            for i in m:
                print(f"  {i} - ${transactions[i]:.2f}")
            print("Bonus Cashback Total:", round(sumcashback(m, transactions), 2))

            excluded = set(transactions.keys()) - m
            base_cashback = sum(transactions[m] * 0.0003 for m in excluded)
            print("0.03% Cashback Total:", round(standard_cashback, 2))
            print("Estimated Total Cashback:", round(standard_cashback + sumcashback(m, transactions), 2))
    else:
        print("No match found.")

    print("Cashback total on bill:", cashback_total)
